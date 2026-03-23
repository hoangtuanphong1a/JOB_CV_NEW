import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, UseGuards, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from './notifications.service';
import { UsersService } from '../users/users.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: any;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/notifications',
})
@Injectable()
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('NotificationsGateway');
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(
    private jwtService: JwtService,
    private notificationsService: NotificationsService,
    private usersService: UsersService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Notifications Gateway initialized');
  }

  async handleConnection(client: AuthenticatedSocket, ...args: any[]) {
    try {
      // Extract token from handshake auth or query
      const token =
        client.handshake.auth?.token || client.handshake.query?.token;

      if (!token) {
        this.logger.error('No token provided');
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = this.jwtService.verify(token as string);
      const user = await this.usersService.findOne(payload.sub);

      if (!user) {
        this.logger.error('User not found');
        client.disconnect();
        return;
      }

      // Store user information on socket
      client.userId = user.id;
      client.user = user;

      // Store connection mapping
      this.connectedUsers.set(user.id, client.id);

      this.logger.log(`User ${user.email} connected with socket ${client.id}`);

      // Send unread notifications count
      const unreadCount = await this.notificationsService.getUnreadCount(
        user.id,
      );
      client.emit('unread_count', { count: unreadCount });

      // Send recent notifications
      const recentNotifications = await this.notificationsService.findAllByUser(
        user.id,
        {
          limit: 10,
        },
      );

      client.emit('recent_notifications', recentNotifications.data);
    } catch (error) {
      this.logger.error('Authentication failed:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.connectedUsers.delete(client.userId);
      this.logger.log(`User ${client.userId} disconnected`);
    }
  }

  @SubscribeMessage('mark_as_read')
  async handleMarkAsRead(
    @MessageBody() data: { notificationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId) return;

    try {
      await this.notificationsService.markAsRead(
        data.notificationId,
        client.userId,
      );

      // Send updated unread count
      const unreadCount = await this.notificationsService.getUnreadCount(
        client.userId,
      );
      client.emit('unread_count', { count: unreadCount });

      client.emit('notification_updated', {
        notificationId: data.notificationId,
        status: 'read',
      });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('mark_all_read')
  async handleMarkAllRead(@ConnectedSocket() client: AuthenticatedSocket) {
    if (!client.userId) return;

    try {
      await this.notificationsService.markAllAsRead(client.userId);

      client.emit('unread_count', { count: 0 });
      client.emit('all_notifications_read');
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('get_unread_count')
  async handleGetUnreadCount(@ConnectedSocket() client: AuthenticatedSocket) {
    if (!client.userId) return;

    try {
      const count = await this.notificationsService.getUnreadCount(
        client.userId,
      );
      client.emit('unread_count', { count });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  // Method to send notifications to specific users
  async sendNotificationToUser(userId: string, notification: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      const socket = this.server.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit('new_notification', notification);

        // Update unread count
        const unreadCount =
          await this.notificationsService.getUnreadCount(userId);
        socket.emit('unread_count', { count: unreadCount });
      }
    }
  }

  // Method to broadcast notifications to all connected users
  async broadcastNotification(notification: any, userIds?: string[]) {
    if (userIds) {
      // Send to specific users
      for (const userId of userIds) {
        await this.sendNotificationToUser(userId, notification);
      }
    } else {
      // Send to all connected users
      this.server.emit('new_notification', notification);

      // Update unread counts for all users
      for (const [userId, socketId] of this.connectedUsers.entries()) {
        const socket = this.server.sockets.sockets.get(socketId);
        if (socket) {
          const unreadCount =
            await this.notificationsService.getUnreadCount(userId);
          socket.emit('unread_count', { count: unreadCount });
        }
      }
    }
  }

  // Method to send job alerts to users
  async sendJobAlert(userId: string, job: any) {
    const notification = {
      type: 'job_alert',
      title: 'New Job Match',
      message: `A new job "${job.title}" matches your profile`,
      data: { jobId: job.id, jobTitle: job.title },
      createdAt: new Date(),
    };

    await this.sendNotificationToUser(userId, notification);
  }

  // Method to send application status updates
  async sendApplicationUpdate(userId: string, application: any, job: any) {
    const notification = {
      type: 'application_update',
      title: 'Application Status Update',
      message: `Your application for "${job.title}" has been ${application.status}`,
      data: {
        applicationId: application.id,
        jobId: job.id,
        status: application.status,
      },
      createdAt: new Date(),
    };

    await this.sendNotificationToUser(userId, notification);
  }

  // Method to send message notifications
  async sendMessageNotification(
    userId: string,
    message: any,
    conversation: any,
  ) {
    const notification = {
      type: 'new_message',
      title: 'New Message',
      message: `You have a new message from ${message.sender.name}`,
      data: { conversationId: conversation.id, messageId: message.id },
      createdAt: new Date(),
    };

    await this.sendNotificationToUser(userId, notification);
  }

  // Method to send system notifications
  async sendSystemNotification(
    userIds: string[],
    title: string,
    message: string,
    data?: any,
  ) {
    const notification = {
      type: 'system',
      title,
      message,
      data,
      createdAt: new Date(),
    };

    await this.broadcastNotification(notification, userIds);
  }
}

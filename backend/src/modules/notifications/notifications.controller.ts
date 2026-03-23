import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { EmailService } from './email.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { NotificationType } from '../common/entities/notification.entity';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly emailService: EmailService,
  ) {}

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user notifications' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'isRead', required: false, type: Boolean })
  @ApiQuery({ name: 'type', required: false, enum: NotificationType })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
  })
  async findAll(@Query() query: any, @Request() req) {
    return this.notificationsService.findAllByUser(req.user.id, query);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.notificationsService.findOne(id, req.user.id);
  }

  @Put(':id/read')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read',
  })
  async markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  @Put(':id/unread')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiOperation({ summary: 'Mark notification as unread' })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as unread',
  })
  async markAsUnread(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsUnread(id, req.user.id);
  }

  @Put('mark-all-read')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read',
  })
  async markAllAsRead(@Request() req) {
    await this.notificationsService.markAllAsRead(req.user.id);
    return { message: 'All notifications marked as read' };
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiOperation({ summary: 'Delete notification' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Notification deleted successfully',
  })
  async remove(@Param('id') id: string, @Request() req) {
    await this.notificationsService.delete(id, req.user.id);
  }

  @Get('stats/overview')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get notification statistics' })
  @ApiResponse({
    status: 200,
    description: 'Notification stats retrieved successfully',
  })
  async getStats(@Request() req) {
    return this.notificationsService.getNotificationStats(req.user.id);
  }

  @Get('unread/count')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get unread notification count' })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
  })
  async getUnreadCount(@Request() req) {
    const count = await this.notificationsService.getUnreadCount(req.user.id);
    return { unreadCount: count };
  }

  // Email Service Test Endpoints
  @Post('test-email')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Send test email (for development only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        to: { type: 'string', example: 'test@example.com' },
        template: {
          type: 'string',
          example: 'welcome',
          enum: [
            'welcome',
            'jobAlert',
            'applicationStatusUpdate',
            'cvViewed',
            'newMessage',
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Test email sent successfully',
  })
  async sendTestEmail(@Body() body: { to: string; template: string }) {
    await this.emailService.sendTestEmail(body.to);
    return { message: 'Test email sent successfully' };
  }

  @Post('verify-email')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Verify email service configuration' })
  @ApiResponse({
    status: 200,
    description: 'Email service status',
  })
  async verifyEmailService() {
    const isConnected = await this.emailService.verifyConnection();
    return {
      emailService: isConnected ? 'CONNECTED' : 'FAILED',
      message: isConnected
        ? 'Email service is properly configured'
        : 'Email service configuration failed. Check SMTP settings.',
    };
  }
}

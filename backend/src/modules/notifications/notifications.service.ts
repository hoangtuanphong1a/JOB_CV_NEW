import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Notification,
  NotificationType,
  NotificationChannel,
} from '../common/entities/notification.entity';
import { User } from '../common/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: {
      channel?: NotificationChannel;
      relatedEntityId?: string;
      relatedEntityType?: string;
      priority?: number;
      expiresAt?: Date;
    },
  ): Promise<Notification> {
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const notification = this.notificationRepository.create({
      userId,
      type,
      title,
      message,
      channel: data?.channel || NotificationChannel.IN_APP,
      relatedEntityId: data?.relatedEntityId,
      relatedEntityType: data?.relatedEntityType,
      priority: data?.priority || 1,
      expiresAt: data?.expiresAt,
    });

    return this.notificationRepository.save(notification);
  }

  async findAllByUser(
    userId: string,
    query: {
      page?: number;
      limit?: number;
      isRead?: boolean;
      type?: NotificationType;
    } = {},
  ): Promise<{
    data: Notification[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    unreadCount: number;
  }> {
    const { page = 1, limit = 20, isRead, type } = query;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (isRead !== undefined) {
      where.isRead = isRead;
    }
    if (type) {
      where.type = type;
    }

    const [notifications, total] =
      await this.notificationRepository.findAndCount({
        where,
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      });

    const unreadCount = await this.notificationRepository.count({
      where: { userId, isRead: false },
    });

    return {
      data: notifications,
      total,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(total / limit),
      unreadCount,
    };
  }

  async findOne(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.findOne(id, userId);
    notification.markAsRead();
    return this.notificationRepository.save(notification);
  }

  async markAsUnread(id: string, userId: string): Promise<Notification> {
    const notification = await this.findOne(id, userId);
    notification.markAsUnread();
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }

  async delete(id: string, userId: string): Promise<void> {
    const notification = await this.findOne(id, userId);
    await this.notificationRepository.remove(notification);
  }

  async deleteExpired(): Promise<void> {
    const now = new Date();
    await this.notificationRepository
      .createQueryBuilder()
      .delete()
      .from(Notification)
      .where('expiresAt IS NOT NULL AND expiresAt < :now', { now })
      .execute();
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, isRead: false },
    });
  }

  async createApplicationReceivedNotification(
    employerId: string,
    jobTitle: string,
    applicantName: string,
    applicationId: string,
  ): Promise<Notification> {
    return this.create(
      employerId,
      NotificationType.APPLICATION_RECEIVED,
      'New Application Received',
      `${applicantName} has applied for your job: ${jobTitle}`,
      {
        relatedEntityId: applicationId,
        relatedEntityType: 'application',
        priority: 3,
      },
    );
  }

  async createApplicationStatusChangedNotification(
    applicantId: string,
    jobTitle: string,
    status: string,
    applicationId: string,
  ): Promise<Notification> {
    return this.create(
      applicantId,
      NotificationType.APPLICATION_STATUS_CHANGED,
      'Application Status Updated',
      `Your application for "${jobTitle}" has been ${status}`,
      {
        relatedEntityId: applicationId,
        relatedEntityType: 'application',
        priority: 2,
      },
    );
  }

  async createJobExpiredNotification(
    employerId: string,
    jobTitle: string,
    jobId: string,
  ): Promise<Notification> {
    return this.create(
      employerId,
      NotificationType.JOB_EXPIRED,
      'Job Expired',
      `Your job "${jobTitle}" has expired and is no longer active`,
      {
        relatedEntityId: jobId,
        relatedEntityType: 'job',
        priority: 2,
      },
    );
  }

  async createSubscriptionExpiredNotification(
    userId: string,
    planName: string,
  ): Promise<Notification> {
    return this.create(
      userId,
      NotificationType.SUBSCRIPTION_EXPIRED,
      'Subscription Expired',
      `Your ${planName} subscription has expired. Renew now to continue using premium features.`,
      {
        priority: 4,
      },
    );
  }

  async createCvViewedNotification(
    jobSeekerId: string,
    companyName: string,
    cvId: string,
  ): Promise<Notification> {
    return this.create(
      jobSeekerId,
      NotificationType.CV_VIEWED,
      'CV Viewed',
      `${companyName} has viewed your CV`,
      {
        relatedEntityId: cvId,
        relatedEntityType: 'cv',
        priority: 1,
      },
    );
  }

  async createSystemAnnouncement(
    userIds: string[],
    title: string,
    message: string,
    expiresAt?: Date,
  ): Promise<Notification[]> {
    const notifications = userIds.map((userId) =>
      this.notificationRepository.create({
        userId,
        type: NotificationType.SYSTEM_ANNOUNCEMENT,
        title,
        message,
        channel: NotificationChannel.IN_APP,
        priority: 2,
        expiresAt,
      }),
    );

    return this.notificationRepository.save(notifications);
  }

  // ===== EXPANDED NOTIFICATION TYPES =====

  async createApplicationApprovedNotification(
    applicantId: string,
    jobTitle: string,
    companyName: string,
    applicationId: string,
  ): Promise<Notification> {
    return this.create(
      applicantId,
      NotificationType.APPLICATION_APPROVED,
      'Application Approved',
      `Congratulations! Your application for "${jobTitle}" at ${companyName} has been approved.`,
      {
        relatedEntityId: applicationId,
        relatedEntityType: 'application',
        priority: 3,
      },
    );
  }

  async createApplicationRejectedNotification(
    applicantId: string,
    jobTitle: string,
    companyName: string,
    applicationId: string,
  ): Promise<Notification> {
    return this.create(
      applicantId,
      NotificationType.APPLICATION_REJECTED,
      'Application Status Update',
      `Your application for "${jobTitle}" at ${companyName} has been reviewed but not selected at this time.`,
      {
        relatedEntityId: applicationId,
        relatedEntityType: 'application',
        priority: 2,
      },
    );
  }

  async createApplicationInterviewScheduledNotification(
    applicantId: string,
    jobTitle: string,
    companyName: string,
    interviewDate: Date,
    applicationId: string,
  ): Promise<Notification> {
    return this.create(
      applicantId,
      NotificationType.APPLICATION_INTERVIEW_SCHEDULED,
      'Interview Scheduled',
      `Great news! ${companyName} has scheduled an interview for "${jobTitle}" on ${interviewDate.toLocaleString()}.`,
      {
        relatedEntityId: applicationId,
        relatedEntityType: 'application',
        priority: 4,
      },
    );
  }

  async createJobApprovedNotification(
    employerId: string,
    jobTitle: string,
    jobId: string,
  ): Promise<Notification> {
    return this.create(
      employerId,
      NotificationType.JOB_APPROVED,
      'Job Approved',
      `Your job "${jobTitle}" has been approved and is now live.`,
      {
        relatedEntityId: jobId,
        relatedEntityType: 'job',
        priority: 3,
      },
    );
  }

  async createJobClosedNotification(
    employerId: string,
    jobTitle: string,
    jobId: string,
  ): Promise<Notification> {
    return this.create(
      employerId,
      NotificationType.JOB_CLOSED,
      'Job Closed',
      `Your job "${jobTitle}" has been closed successfully.`,
      {
        relatedEntityId: jobId,
        relatedEntityType: 'job',
        priority: 2,
      },
    );
  }

  async createSubscriptionRenewedNotification(
    userId: string,
    planName: string,
    expiryDate: Date,
  ): Promise<Notification> {
    return this.create(
      userId,
      NotificationType.SUBSCRIPTION_RENEWED,
      'Subscription Renewed',
      `Your ${planName} subscription has been successfully renewed. Valid until ${expiryDate.toDateString()}.`,
      {
        priority: 2,
      },
    );
  }

  async createCvDownloadedNotification(
    jobSeekerId: string,
    companyName: string,
    cvId: string,
  ): Promise<Notification> {
    return this.create(
      jobSeekerId,
      NotificationType.CV_DOWNLOADED,
      'CV Downloaded',
      `${companyName} has downloaded your CV.`,
      {
        relatedEntityId: cvId,
        relatedEntityType: 'cv',
        priority: 1,
      },
    );
  }

  async createBlogCommentApprovedNotification(
    authorId: string,
    blogTitle: string,
    commentId: string,
  ): Promise<Notification> {
    return this.create(
      authorId,
      NotificationType.BLOG_COMMENT_APPROVED,
      'Comment Approved',
      `Your comment on "${blogTitle}" has been approved and is now visible.`,
      {
        relatedEntityId: commentId,
        relatedEntityType: 'blog_comment',
        priority: 1,
      },
    );
  }

  async createBlogCommentRejectedNotification(
    authorId: string,
    blogTitle: string,
    commentId: string,
  ): Promise<Notification> {
    return this.create(
      authorId,
      NotificationType.BLOG_COMMENT_REJECTED,
      'Comment Not Approved',
      `Your comment on "${blogTitle}" could not be approved at this time.`,
      {
        relatedEntityId: commentId,
        relatedEntityType: 'blog_comment',
        priority: 1,
      },
    );
  }

  async createBlogNewCommentNotification(
    blogAuthorId: string,
    commenterName: string,
    blogTitle: string,
    commentId: string,
  ): Promise<Notification> {
    return this.create(
      blogAuthorId,
      NotificationType.BLOG_NEW_COMMENT,
      'New Comment on Your Blog',
      `${commenterName} commented on your blog "${blogTitle}".`,
      {
        relatedEntityId: commentId,
        relatedEntityType: 'blog_comment',
        priority: 1,
      },
    );
  }

  async createMessageReceivedNotification(
    recipientId: string,
    senderName: string,
    messagePreview: string,
    threadId: string,
  ): Promise<Notification> {
    return this.create(
      recipientId,
      NotificationType.MESSAGE_RECEIVED,
      'New Message',
      `${senderName}: ${messagePreview.substring(0, 50)}${messagePreview.length > 50 ? '...' : ''}`,
      {
        relatedEntityId: threadId,
        relatedEntityType: 'message_thread',
        priority: 2,
      },
    );
  }

  async createCompanyVerifiedNotification(
    ownerId: string,
    companyName: string,
  ): Promise<Notification> {
    return this.create(
      ownerId,
      NotificationType.COMPANY_VERIFIED,
      'Company Verified',
      `Congratulations! Your company "${companyName}" has been verified. You now have access to enhanced features.`,
      {
        priority: 3,
      },
    );
  }

  async createCompanyUnverifiedNotification(
    ownerId: string,
    companyName: string,
  ): Promise<Notification> {
    return this.create(
      ownerId,
      NotificationType.COMPANY_UNVERIFIED,
      'Company Verification Update',
      `Your company "${companyName}" verification status has changed. Please update your company information.`,
      {
        priority: 2,
      },
    );
  }

  // ===== BULK NOTIFICATION METHODS =====

  async notifyAllUsersAboutSystemUpdate(
    title: string,
    message: string,
    userRole?: string,
  ): Promise<number> {
    let userIds: string[];

    if (userRole) {
      // Get users with specific role
      const users = await this.userRepository.find({
        relations: ['userRoles', 'userRoles.role'],
      });

      userIds = users
        .filter((user) =>
          user.userRoles?.some((ur) => ur.role.name === (userRole as any)),
        )
        .map((user) => user.id);
    } else {
      // Get all users
      const users = await this.userRepository.find();
      userIds = users.map((user) => user.id);
    }

    const notifications = await this.createSystemAnnouncement(
      userIds,
      title,
      message,
    );

    return notifications.length;
  }

  async notifyEmployersAboutNewFeature(
    title: string,
    message: string,
  ): Promise<number> {
    const users = await this.userRepository.find({
      relations: ['userRoles', 'userRoles.role'],
    });

    const employerIds = users
      .filter((user) =>
        user.userRoles?.some((userRole) => userRole.role.name === 'employer'),
      )
      .map((user) => user.id);

    const notifications = await this.createSystemAnnouncement(
      employerIds,
      title,
      message,
    );

    return notifications.length;
  }

  async notifyJobSeekersAboutNewJobs(
    jobTitle: string,
    companyName: string,
    matchingUserIds: string[],
  ): Promise<number> {
    const notifications = await Promise.all(
      matchingUserIds.map((userId) =>
        this.create(
          userId,
          NotificationType.SYSTEM_ANNOUNCEMENT,
          'New Job Match',
          `A new job "${jobTitle}" at ${companyName} matches your profile.`,
          {
            priority: 2,
          },
        ),
      ),
    );

    return notifications.length;
  }

  async getNotificationStats(userId: string): Promise<{
    total: number;
    unread: number;
    read: number;
    byType: Record<string, number>;
  }> {
    const [total, unread, read] = await Promise.all([
      this.notificationRepository.count({ where: { userId } }),
      this.notificationRepository.count({ where: { userId, isRead: false } }),
      this.notificationRepository.count({ where: { userId, isRead: true } }),
    ]);

    const byType = await this.notificationRepository
      .createQueryBuilder('notification')
      .select('notification.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('notification.userId = :userId', { userId })
      .groupBy('notification.type')
      .getRawMany();

    const byTypeRecord: Record<string, number> = {};
    byType.forEach((item) => {
      byTypeRecord[item.type] = parseInt(item.count);
    });

    return {
      total,
      unread,
      read,
      byType: byTypeRecord,
    };
  }
}

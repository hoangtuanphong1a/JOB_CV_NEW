import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

export enum NotificationType {
  APPLICATION_RECEIVED = 'application_received',
  APPLICATION_STATUS_CHANGED = 'application_status_changed',
  APPLICATION_APPROVED = 'application_approved',
  APPLICATION_REJECTED = 'application_rejected',
  APPLICATION_INTERVIEW_SCHEDULED = 'application_interview_scheduled',
  JOB_APPROVED = 'job_approved',
  JOB_CLOSED = 'job_closed',
  JOB_EXPIRED = 'job_expired',
  SUBSCRIPTION_EXPIRED = 'subscription_expired',
  SUBSCRIPTION_RENEWED = 'subscription_renewed',
  CV_VIEWED = 'cv_viewed',
  CV_DOWNLOADED = 'cv_downloaded',
  BLOG_COMMENT_APPROVED = 'blog_comment_approved',
  BLOG_COMMENT_REJECTED = 'blog_comment_rejected',
  BLOG_NEW_COMMENT = 'blog_new_comment',
  MESSAGE_RECEIVED = 'message_received',
  COMPANY_VERIFIED = 'company_verified',
  COMPANY_UNVERIFIED = 'company_unverified',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
}

export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  PUSH = 'push',
  SMS = 'sms',
}

@Entity('notifications')
export class Notification extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'varchar',
    default: NotificationType.SYSTEM_ANNOUNCEMENT,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'varchar',
    default: NotificationChannel.IN_APP,
  })
  channel: NotificationChannel;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'datetime', nullable: true })
  readAt?: Date;

  @Column({ type: 'json', nullable: true })
  data?: Record<string, any>; // Additional data for the notification

  @Column({ nullable: true })
  relatedEntityId?: string; // ID of related entity (job, application, etc.)

  @Column({ nullable: true })
  relatedEntityType?: string; // Type of related entity

  @Column({ type: 'int', default: 1 })
  priority: number; // 1: low, 2: medium, 3: high, 4: urgent

  @Column({ type: 'datetime', nullable: true })
  expiresAt?: Date;

  get isExpired(): boolean {
    return this.expiresAt ? new Date() > this.expiresAt : false;
  }

  markAsRead(): void {
    this.isRead = true;
    this.readAt = new Date();
  }

  markAsUnread(): void {
    this.isRead = false;
    this.readAt = undefined;
  }
}

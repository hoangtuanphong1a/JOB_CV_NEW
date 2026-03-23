import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { MessageThread } from './message-thread.entity';
import { User } from './user.entity';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  SYSTEM = 'system',
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
}

@Entity('messages')
export class Message {
  @Column({ primary: true, type: 'varchar' })
  id: string; // Sử dụng cuid hoặc uuid

  @Column({ name: 'thread_id', type: 'varchar' })
  threadId: string;

  @Column({ name: 'sender_user_id' })
  senderUserId: string;

  @Column({ type: 'text' })
  body: string;

  @Column({
    type: 'varchar',
    default: MessageType.TEXT,
  })
  messageType: MessageType;

  @Column({
    type: 'varchar',
    default: MessageStatus.SENT,
  })
  status: MessageStatus;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  sentAt: Date;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'datetime', nullable: true })
  readAt?: Date;

  @Column({ type: 'text', nullable: true })
  attachmentUrl?: string; // URL file đính kèm

  @Column({ type: 'varchar', nullable: true })
  attachmentName?: string; // Tên file đính kèm

  @Column({ type: 'bigint', nullable: true })
  attachmentSize?: number; // Kích thước file (bytes)

  @Column({ type: 'text', nullable: true })
  metadata?: string; // JSON metadata (reactions, mentions, etc.)

  // Relationships
  @ManyToOne(() => MessageThread, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'thread_id' })
  thread: MessageThread;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_user_id' })
  sender: User;

  // Helper methods
  get senderName(): string {
    return this.sender?.fullName || 'Unknown User';
  }

  get senderAvatar(): string | null {
    return this.sender?.avatarUrl || this.sender?.avatar || null;
  }

  get hasAttachment(): boolean {
    return !!(this.attachmentUrl && this.attachmentName);
  }

  get attachmentSizeFormatted(): string {
    if (!this.attachmentSize) return '';

    const units = ['B', 'KB', 'MB', 'GB'];
    let size = this.attachmentSize;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  markAsRead(): void {
    this.isRead = true;
    this.readAt = new Date();
    this.status = MessageStatus.READ;
  }

  markAsDelivered(): void {
    if (this.status === MessageStatus.SENT) {
      this.status = MessageStatus.DELIVERED;
    }
  }

  get isSystemMessage(): boolean {
    return this.messageType === MessageType.SYSTEM;
  }

  get isMediaMessage(): boolean {
    return (
      this.messageType === MessageType.IMAGE ||
      this.messageType === MessageType.FILE
    );
  }

  // Parse metadata JSON
  get parsedMetadata(): any {
    if (!this.metadata) return {};
    try {
      return JSON.parse(this.metadata);
    } catch {
      return {};
    }
  }

  // Update metadata
  updateMetadata(metadata: any): void {
    this.metadata = JSON.stringify(metadata);
  }
}

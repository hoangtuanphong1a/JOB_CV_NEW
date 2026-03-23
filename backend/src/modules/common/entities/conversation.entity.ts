import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

export enum ConversationType {
  DIRECT = 'direct',
  GROUP = 'group',
}

export enum ConversationStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  BLOCKED = 'blocked',
}

@Entity('conversations')
@Unique(['user1', 'user2'])
export class Conversation extends BaseEntity {
  @Column({
    type: 'varchar',
    default: ConversationType.DIRECT,
  })
  conversationType: ConversationType;

  @Column({
    type: 'varchar',
    default: ConversationStatus.ACTIVE,
  })
  status: ConversationStatus;

  // For direct conversations
  @Column({ name: 'user1_id' })
  user1Id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user1_id' })
  user1: User;

  @Column({ name: 'user2_id' })
  user2Id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user2_id' })
  user2: User;

  // Optional group conversation fields
  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ name: 'created_by_id', nullable: true })
  createdById?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by_id' })
  createdBy?: User;

  @Column({ type: 'datetime', nullable: true })
  lastMessageAt?: Date;

  @Column({ type: 'int', default: 0 })
  messageCount: number;

  // Note: Messages are now handled by MessageThread entity
  // @OneToMany(() => Message, (message) => message.conversation)
  // messages: Message[];

  getOtherUser(currentUserId: string): User {
    return this.user1Id === currentUserId ? this.user2 : this.user1;
  }

  getDisplayName(currentUserId: string): string {
    if (this.conversationType === ConversationType.GROUP) {
      return this.name || 'Group Chat';
    }
    return this.getOtherUser(currentUserId).fullName;
  }

  updateLastMessage(): void {
    this.lastMessageAt = new Date();
    this.messageCount += 1;
  }
}

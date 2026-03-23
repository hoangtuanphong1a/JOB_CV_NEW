import { Entity } from 'typeorm/decorator/entity/Entity';
import { Column } from 'typeorm/decorator/columns/Column';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { JoinColumn } from 'typeorm/decorator/relations/JoinColumn';
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn';
import { MessageThread } from './message-thread.entity';
import { User } from './user.entity';

export enum ParticipantRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Entity('thread_participants')
export class ThreadParticipant {
  @PrimaryColumn({ name: 'thread_id', type: 'varchar' })
  threadId: string;

  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'varchar',
    default: ParticipantRole.MEMBER,
  })
  role: ParticipantRole;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  joinedAt: Date;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  isMuted: boolean;

  @Column({ type: 'datetime', nullable: true })
  lastReadAt?: Date;

  // Relationships
  @ManyToOne(() => MessageThread, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'thread_id' })
  thread: MessageThread;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Helper methods
  get displayName(): string {
    return this.user?.fullName || 'Unknown User';
  }

  get avatarUrl(): string | null {
    return this.user?.avatarUrl || this.user?.avatar || null;
  }

  markAsRead(): void {
    this.lastReadAt = new Date();
  }

  mute(): void {
    this.isMuted = true;
  }

  unmute(): void {
    this.isMuted = false;
  }

  promoteToAdmin(): void {
    this.role = ParticipantRole.ADMIN;
  }

  demoteToMember(): void {
    this.role = ParticipantRole.MEMBER;
  }

  get isOwner(): boolean {
    return this.role === ParticipantRole.OWNER;
  }

  get isAdmin(): boolean {
    return this.role === ParticipantRole.ADMIN || this.isOwner;
  }
}

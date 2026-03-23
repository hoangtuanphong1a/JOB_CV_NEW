import { Entity } from 'typeorm/decorator/entity/Entity';
import { Column } from 'typeorm/decorator/columns/Column';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { ThreadParticipant } from './thread-participant.entity';
import { Message } from './message.entity';

@Entity('message_threads')
export class MessageThread {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  subject?: string; // Tiêu đề cuộc trò chuyện

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  updatedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  lastMessageAt?: Date;

  // Relationships
  @OneToMany(() => ThreadParticipant, (participant) => participant.thread)
  participants: ThreadParticipant[];

  @OneToMany(() => Message, (message) => message.thread)
  messages: Message[];

  // Helper methods
  get participantCount(): number {
    return this.participants?.length || 0;
  }

  get messageCount(): number {
    return this.messages?.length || 0;
  }

  get lastMessage(): Message | null {
    if (!this.messages || this.messages.length === 0) return null;
    return this.messages[this.messages.length - 1];
  }

  get isGroupChat(): boolean {
    return this.participantCount > 2;
  }

  updateLastMessageTime(): void {
    this.lastMessageAt = new Date();
    this.updatedAt = new Date();
  }
}

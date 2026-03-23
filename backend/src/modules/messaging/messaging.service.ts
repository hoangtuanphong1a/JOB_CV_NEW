import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageThread } from '../common/entities/message-thread.entity';
import {
  ThreadParticipant,
  ParticipantRole,
} from '../common/entities/thread-participant.entity';
import {
  Message,
  MessageType,
  MessageStatus,
} from '../common/entities/message.entity';
import { User } from '../common/entities/user.entity';

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(MessageThread)
    private messageThreadRepository: Repository<MessageThread>,
    @InjectRepository(ThreadParticipant)
    private threadParticipantRepository: Repository<ThreadParticipant>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createConversation(
    user1Id: string,
    user2Id: string,
  ): Promise<MessageThread> {
    // Check if conversation already exists
    const existingThread = await this.threadParticipantRepository
      .createQueryBuilder('tp1')
      .innerJoin('thread_participants', 'tp2', 'tp1.threadId = tp2.threadId')
      .where('tp1.userId = :user1Id AND tp2.userId = :user2Id', {
        user1Id,
        user2Id,
      })
      .select('tp1.threadId')
      .getRawOne();

    if (existingThread) {
      const thread = await this.messageThreadRepository.findOne({
        where: { id: existingThread.threadId },
      });
      if (thread) return thread;
    }

    // Verify users exist
    const [user1, user2] = await Promise.all([
      this.userRepository.findOne({ where: { id: user1Id } }),
      this.userRepository.findOne({ where: { id: user2Id } }),
    ]);

    if (!user1 || !user2) {
      throw new NotFoundException('One or both users not found');
    }

    // Create thread
    const thread = this.messageThreadRepository.create();
    const savedThread = await this.messageThreadRepository.save(thread);

    // Create participants
    const participants = [
      this.threadParticipantRepository.create({
        threadId: savedThread.id,
        userId: user1Id,
        role: ParticipantRole.OWNER,
      }),
      this.threadParticipantRepository.create({
        threadId: savedThread.id,
        userId: user2Id,
        role: ParticipantRole.MEMBER,
      }),
    ];

    await this.threadParticipantRepository.save(participants);
    return savedThread;
  }

  async findUserConversations(userId: string): Promise<MessageThread[]> {
    const participants = await this.threadParticipantRepository.find({
      where: { userId },
      relations: ['thread'],
    });

    const threads = participants.map((p) => p.thread);
    return threads.sort(
      (a, b) =>
        (b.lastMessageAt?.getTime() || 0) - (a.lastMessageAt?.getTime() || 0),
    );
  }

  async findConversationById(
    id: string,
    userId: string,
  ): Promise<MessageThread> {
    const participant = await this.threadParticipantRepository.findOne({
      where: { threadId: id, userId },
      relations: ['thread', 'thread.participants', 'thread.messages'],
    });

    if (!participant) {
      throw new NotFoundException('Conversation not found or access denied');
    }

    return participant.thread;
  }

  async sendMessage(
    threadId: string,
    senderId: string,
    content: string,
    messageType: MessageType = MessageType.TEXT,
    fileData?: { fileUrl?: string; fileName?: string; fileSize?: number },
  ): Promise<Message> {
    // Verify sender is participant
    const participant = await this.threadParticipantRepository.findOne({
      where: { threadId, userId: senderId },
    });

    if (!participant) {
      throw new BadRequestException('You are not part of this conversation');
    }

    // Create message with generated ID (cuid/uuid)
    const messageId = this.generateId();
    const message = this.messageRepository.create({
      id: messageId,
      threadId,
      senderUserId: senderId,
      body: content,
      messageType,
      attachmentUrl: fileData?.fileUrl,
      attachmentName: fileData?.fileName,
      attachmentSize: fileData?.fileSize,
    });

    const savedMessage = await this.messageRepository.save(message);

    // Update thread last message time
    await this.messageThreadRepository.update(threadId, {
      lastMessageAt: new Date(),
    });

    return this.messageRepository.findOne({
      where: { id: savedMessage.id },
      relations: ['sender'],
    }) as Promise<Message>;
  }

  async getConversationMessages(
    threadId: string,
    userId: string,
    query: { page?: number; limit?: number } = {},
  ): Promise<{ data: Message[]; total: number; page: number; limit: number }> {
    // Verify user is participant
    const participant = await this.threadParticipantRepository.findOne({
      where: { threadId, userId },
    });

    if (!participant) {
      throw new BadRequestException('You are not part of this conversation');
    }

    const { page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const [messages, total] = await this.messageRepository.findAndCount({
      where: { threadId },
      relations: ['sender'],
      order: { sentAt: 'ASC' },
      skip,
      take: limit,
    });

    return { data: messages, total, page: +page, limit: +limit };
  }

  async markMessagesAsRead(threadId: string, userId: string): Promise<void> {
    await this.messageRepository.update(
      { threadId, senderUserId: userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }

  async getUnreadMessageCount(userId: string): Promise<number> {
    const participants = await this.threadParticipantRepository.find({
      where: { userId },
      select: ['threadId'],
    });

    const threadIds = participants.map((p) => p.threadId);

    if (threadIds.length === 0) return 0;

    // Count messages from other users that are unread
    let totalUnread = 0;
    for (const threadId of threadIds) {
      const count = await this.messageRepository.count({
        where: { threadId, senderUserId: userId, isRead: false },
      });
      totalUnread += count;
    }

    return totalUnread;
  }

  private generateId(): string {
    // Simple ID generator - in production, use cuid or uuid
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagingController } from './messaging.controller';
import { MessagingService } from './messaging.service';
import { MessageThread } from '../common/entities/message-thread.entity';
import { ThreadParticipant } from '../common/entities/thread-participant.entity';
import { Message } from '../common/entities/message.entity';
import { User } from '../common/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageThread, ThreadParticipant, Message, User]),
  ],
  controllers: [MessagingController],
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}

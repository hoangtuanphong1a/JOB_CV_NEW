import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { MessagingService } from './messaging.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { MessageType } from '../common/entities/message.entity';

@ApiTags('Messaging')
@Controller('messaging')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post('conversations/:userId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'userId', description: 'Other user ID' })
  @ApiOperation({ summary: 'Create or get conversation with another user' })
  @ApiResponse({
    status: 201,
    description: 'Conversation created or retrieved successfully',
  })
  async createConversation(
    @Param('userId') otherUserId: string,
    @Request() req,
  ) {
    return this.messagingService.createConversation(req.user.id, otherUserId);
  }

  @Get('conversations')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user conversations' })
  @ApiResponse({
    status: 200,
    description: 'Conversations retrieved successfully',
  })
  async getConversations(@Request() req) {
    return this.messagingService.findUserConversations(req.user.id);
  }

  @Get('conversations/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiOperation({ summary: 'Get conversation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Conversation retrieved successfully',
  })
  async getConversation(@Param('id') id: string, @Request() req) {
    return this.messagingService.findConversationById(id, req.user.id);
  }

  @Post('conversations/:id/messages')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiOperation({ summary: 'Send message in conversation' })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
  })
  async sendMessage(
    @Param('id') conversationId: string,
    @Body() body: { content: string; messageType?: MessageType },
    @Request() req,
  ) {
    return this.messagingService.sendMessage(
      conversationId,
      req.user.id,
      body.content,
      body.messageType,
    );
  }

  @Get('conversations/:id/messages')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiOperation({ summary: 'Get conversation messages' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully',
  })
  async getMessages(
    @Param('id') conversationId: string,
    @Query() query: any,
    @Request() req,
  ) {
    return this.messagingService.getConversationMessages(
      conversationId,
      req.user.id,
      query,
    );
  }

  @Post('conversations/:id/read')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiOperation({ summary: 'Mark conversation messages as read' })
  @ApiResponse({
    status: 200,
    description: 'Messages marked as read',
  })
  async markAsRead(@Param('id') conversationId: string, @Request() req) {
    await this.messagingService.markMessagesAsRead(conversationId, req.user.id);
    return { message: 'Messages marked as read' };
  }

  @Get('unread/count')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get unread message count' })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
  })
  async getUnreadCount(@Request() req) {
    const count = await this.messagingService.getUnreadMessageCount(
      req.user.id,
    );
    return { unreadCount: count };
  }
}

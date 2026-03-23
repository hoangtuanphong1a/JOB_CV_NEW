import { api } from './api';

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
    role: 'employer' | 'job_seeker' | 'hr' | 'admin';
    company?: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}

export class MessagingService {
  static async getConversations(): Promise<Conversation[]> {
    const response = await api.get('/messages/conversations');
    return response.data;
  }

  static async getConversation(conversationId: string): Promise<ConversationWithMessages> {
    const response = await api.get(`/messages/conversations/${conversationId}`);
    return response.data;
  }

  static async createConversation(participantId: string, initialMessage?: string): Promise<Conversation> {
    const response = await api.post('/messages/conversations', {
      participantId,
      initialMessage
    });
    return response.data;
  }

  static async sendMessage(conversationId: string, content: string, type: 'text' | 'image' | 'file' = 'text'): Promise<Message> {
    const response = await api.post(`/messages/conversations/${conversationId}/messages`, {
      content,
      type
    });
    return response.data;
  }

  static async sendFile(conversationId: string, file: File): Promise<Message> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/messages/conversations/${conversationId}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  static async markAsRead(conversationId: string): Promise<void> {
    await api.post(`/messages/conversations/${conversationId}/read`);
  }

  static async markMessageAsRead(messageId: string): Promise<void> {
    await api.post(`/messages/messages/${messageId}/read`);
  }

  static async deleteConversation(conversationId: string): Promise<void> {
    await api.delete(`/messages/conversations/${conversationId}`);
  }

  static async deleteMessage(messageId: string): Promise<void> {
    await api.delete(`/messages/messages/${messageId}`);
  }

  static async getUnreadCount(): Promise<{ total: number; conversations: { id: string; count: number }[] }> {
    const response = await api.get('/messages/unread-count');
    return response.data;
  }

  static async searchConversations(query: string): Promise<Conversation[]> {
    const response = await api.get('/messages/conversations/search', {
      params: { q: query }
    });
    return response.data;
  }

  static async getConversationParticipants(conversationId: string): Promise<{ id: string; name: string; avatar?: string; role: string }[]> {
    const response = await api.get(`/messages/conversations/${conversationId}/participants`);
    return response.data;
  }

  static async addParticipant(conversationId: string, participantId: string): Promise<void> {
    await api.post(`/messages/conversations/${conversationId}/participants`, {
      participantId
    });
  }

  static async removeParticipant(conversationId: string, participantId: string): Promise<void> {
    await api.delete(`/messages/conversations/${conversationId}/participants/${participantId}`);
  }

  static async blockUser(userId: string): Promise<void> {
    await api.post(`/messages/block/${userId}`);
  }

  static async unblockUser(userId: string): Promise<void> {
    await api.delete(`/messages/block/${userId}`);
  }

  static async getBlockedUsers(): Promise<{ id: string; name: string; avatar?: string; blockedAt: string }[]> {
    const response = await api.get('/messages/blocked');
    return response.data;
  }
}

export default MessagingService;

import { request } from '../../axios';
import { KEYS } from './keys';
import {
  BaseResponse,
  NotificationListParams,
  NotificationListResponse,
  NotificationResponse,
  UnreadCountResponse,
} from './types';

export const NotificationService = {
  getNotifications: async (
    params?: NotificationListParams
  ): Promise<NotificationListResponse> => {
    // Interceptor đã trả về response.data
    return (await request.get<NotificationListResponse>(KEYS.listPath, {
      params,
    })) as unknown as NotificationListResponse;
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    // Interceptor đã trả về response.data
    const response = (await request.get<UnreadCountResponse>(KEYS.unreadCountPath)) as unknown as UnreadCountResponse;
    return response ?? { unread_count: 0 };
  },

  markAsRead: async (id: string): Promise<NotificationResponse> => {
    // Interceptor đã trả về response.data
    return (await request.put<NotificationResponse>(KEYS.markReadPath(id))) as unknown as NotificationResponse;
  },

  markAsUnread: async (id: string): Promise<NotificationResponse> => {
    // Interceptor đã trả về response.data
    return (await request.put<NotificationResponse>(KEYS.markUnreadPath(id))) as unknown as NotificationResponse;
  },

  markAllAsRead: async (): Promise<BaseResponse> => {
    // Interceptor đã trả về response.data
    return (await request.put<BaseResponse>(KEYS.markAllReadPath)) as unknown as BaseResponse;
  },
};



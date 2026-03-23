import { api } from './api';

export interface Notification {
  id: string;
  userId: string;
  type: 'application_received' | 'application_status_changed' | 'job_expired' | 'new_message' | 'system' | 'marketing';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export class NotificationService {
  static async getNotifications(params?: { page?: number; limit?: number; unreadOnly?: boolean }): Promise<{ data: Notification[]; total: number; unreadCount: number }> {
    const response = await api.get('/notifications', { params });
    return response.data;
  }

  static async getNotification(notificationId: string): Promise<Notification> {
    const response = await api.get(`/notifications/${notificationId}`);
    return response.data;
  }

  static async markAsRead(notificationId: string): Promise<void> {
    await api.post(`/notifications/${notificationId}/read`);
  }

  static async markAllAsRead(): Promise<void> {
    await api.post('/notifications/read-all');
  }

  static async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  }

  static async getUnreadCount(): Promise<{ total: number }> {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  }

  static async updateNotificationPreferences(preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    applicationUpdates: boolean;
    jobAlerts: boolean;
    marketingEmails: boolean;
  }): Promise<void> {
    await api.put('/notifications/preferences', preferences);
  }

  static async getNotificationPreferences(): Promise<{
    emailNotifications: boolean;
    pushNotifications: boolean;
    applicationUpdates: boolean;
    jobAlerts: boolean;
    marketingEmails: boolean;
  }> {
    const response = await api.get('/notifications/preferences');
    return response.data;
  }

  static async sendTestNotification(): Promise<void> {
    await api.post('/notifications/test');
  }

  static async subscribeToPushNotifications(subscription: PushSubscription): Promise<void> {
    await api.post('/notifications/push-subscription', {
      endpoint: subscription.endpoint,
      keys: subscription.toJSON().keys
    });
  }

  static async unsubscribeFromPushNotifications(): Promise<void> {
    await api.delete('/notifications/push-subscription');
  }
}

export default NotificationService;

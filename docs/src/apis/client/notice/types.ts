export interface NotificationItem {
  id: string;
  user_id: string;
  type: string;
  ref_id: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  post_id?: string; // Post ID for navigation (for comment, reply, like notifications)
  post_slug?: string; // Post slug for navigation URL
}

export interface NotificationListMeta {
  total_items?: number;
  current_page?: number;
  items_per_page?: number;
  total_pages?: number;
  unread_only?: boolean;
  type?: string | null;
}

export interface NotificationListResponse {
  status: boolean;
  messages: string[];
  data: NotificationItem[];
  meta?: NotificationListMeta;
}

export interface NotificationListParams {
  unread_only?: boolean;
  type?: string;
  page?: number;
  limit?: number;
}

export type NotificationResponse = NotificationItem;

export interface UnreadCountResponse {
  unread_count: number;
}

export interface BaseResponse {
  status: boolean;
  messages: string[];
}



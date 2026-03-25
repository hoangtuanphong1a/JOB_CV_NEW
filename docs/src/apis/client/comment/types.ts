export interface CommentAuthor {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

export interface CommentEntity {
  id: string;
  post_id: string;
  user_id: string;
  author: CommentAuthor | null;
  parent_id: string | null;
  content: string;
  status: string;
  depth: number;
  report_count: number;
  is_edited: boolean;
  replies_count: number;
  replies: CommentEntity[];
  created_at: string;
  updated_at: string | null;
}

export interface CommentListMeta {
  total_items?: number;
  current_page?: number;
  items_per_page?: number;
  threaded?: boolean;
}

export interface CommentListResponse {
  status: boolean;
  messages: string[];
  data: CommentEntity[];
  meta?: CommentListMeta;
}

export interface CommentListParams {
  threaded?: boolean;
  page?: number;
  limit?: number;
  status?: string;
}

export interface CreateCommentPayload {
  content: string;
  parent_id?: string;
}



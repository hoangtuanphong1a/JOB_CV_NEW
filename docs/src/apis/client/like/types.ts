export interface LikeUser {
  user_id: string;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  liked_at: string;
}

export interface LikeActionResponse {
  liked: boolean;
  likes_count: number;
}

export interface LikeSummaryResponse {
  likes_count: number;
  liked_by_current_user: boolean;
  recent_likes: LikeUser[];
}

export interface LikeListResponse {
  total: number;
  page: number;
  limit: number;
  items: LikeUser[];
}

export interface LikeListParams {
  page?: number;
  limit?: number;
}

export interface LikeSummaryParams {
  recent_limit?: number;
}



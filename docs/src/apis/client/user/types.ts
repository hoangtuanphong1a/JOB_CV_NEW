// User Profile Types based on backend schemas

export interface ProfileUpdateRequest {
  username?: string;
  full_name?: string;
  bio?: string;
  show_email?: string;
  website?: string;
  twitter_url?: string;
  facebook_url?: string;
  linkedin_url?: string;
  github_url?: string;
}

export interface PublicProfileResponse {
  id: string;
  username?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  website?: string;
  twitter_url?: string;
  facebook_url?: string;
  linkedin_url?: string;
  github_url?: string;
  posts_count: number;
  followers_count: number;
  following_count: number;
  created_at: string;
  email?: string; // Only included if show_email is True
}

export interface PrivateProfileResponse {
  id: string;
  username?: string;
  email: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  show_email: string;
  website?: string;
  twitter_url?: string;
  facebook_url?: string;
  linkedin_url?: string;
  github_url?: string;
  posts_count: number;
  followers_count: number;
  following_count: number;
  is_2fa_enabled: boolean;
  created_at: string;
}

export interface AvatarUploadResponse {
  avatar_url: string;
  message?: string;
}

export interface UserStatsResponse {
  posts_count: number;
  followers_count: number;
  following_count: number;
}

// Admin User Management Types
export interface AdminUser {
  id: string;
  username: string | null;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_active: boolean;
  is_banned: boolean;
  roles: string[]; // Array of role names
  created_at: string;
  updated_at: string | null;
}

export interface AdminUsersListResponse {
  data: AdminUser[];
  meta?: {
    total_items?: number;
    current_page?: number;
    items_per_page?: number;
    total_pages?: number;
  };
}


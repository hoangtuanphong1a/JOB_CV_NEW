/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from '../../axios';
import { KEYS } from './keys';
import {
  ProfileUpdateRequest,
  PrivateProfileResponse,
  PublicProfileResponse,
  AvatarUploadResponse,
  UserStatsResponse,
  AdminUser,
} from './types';

export const UserService = {
  /**
   * Get current user's profile (private)
   */
  getMyProfile: async (): Promise<PrivateProfileResponse> => {
    const data = await request.get<PrivateProfileResponse>(KEYS.USER_ME);
    return data as any;
  },

  /**
   * Update current user's profile
   */
  updateMyProfile: async (payload: ProfileUpdateRequest): Promise<PrivateProfileResponse> => {
    const data = await request.put<PrivateProfileResponse>(KEYS.USER_ME, payload);
    return data as any;
  },

  /**
   * Upload avatar image
   */
  uploadAvatar: async (file: File): Promise<AvatarUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const data = await request.post<AvatarUploadResponse>(KEYS.USER_ME_AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data as any;
  },

  /**
   * Get public profile by username
   */
  getPublicProfile: async (username: string): Promise<PublicProfileResponse> => {
    const data = await request.get<PublicProfileResponse>(KEYS.USER_BY_USERNAME(username));
    return data as any;
  },

  /**
   * Get user statistics by username
   */
  getUserStats: async (username: string): Promise<UserStatsResponse> => {
    const data = await request.get<UserStatsResponse>(KEYS.USER_STATS(username));
    return data as any;
  },

  /**
   * Get all users (admin only)
   */
  getAllUsers: async (): Promise<AdminUser[]> => {
    // APIResponse format: { status: boolean, messages: string[], data: AdminUser[] }
    // Interceptor returns response.data, so response is already { status, messages, data }
    const response = await request.get<{ status: boolean; messages: string[]; data: AdminUser[] }>(KEYS.ADMIN_USERS) as any;
    return response?.data || [];
  },

  /**
   * Ban a user (admin only)
   */
  banUser: async (userId: string): Promise<void> => {
    await request.post(KEYS.ADMIN_USERS_BAN(userId));
  },

  /**
   * Unban a user (admin only)
   */
  unbanUser: async (userId: string): Promise<void> => {
    await request.delete(KEYS.ADMIN_USERS_BAN(userId));
  },

  /**
   * Delete a user (admin only)
   */
  deleteUser: async (userId: string, hardDelete: boolean = false): Promise<void> => {
    await request.delete(KEYS.ADMIN_USERS_DELETE(userId), {
      params: { hard_delete: hardDelete },
    });
  },
};


import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { KEYS } from './keys';
import { UserService } from './requests';
import {
  ProfileUpdateRequest,
  PrivateProfileResponse,
  PublicProfileResponse,
  AvatarUploadResponse,
  UserStatsResponse,
  AdminUser,
} from './types';

/**
 * Get current user's profile (private)
 */
export const useGetMyProfileQuery = (
  options?: Omit<UseQueryOptions<PrivateProfileResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<PrivateProfileResponse, Error>({
    queryKey: [KEYS.USER_ME],
    queryFn: () => UserService.getMyProfile(),
    ...options,
  });
};

/**
 * Update current user's profile
 */
export const useUpdateMyProfileMutation = (
  options?: Omit<
    UseMutationOptions<PrivateProfileResponse, Error, ProfileUpdateRequest, unknown>,
    'mutationFn'
  >
) => {
  return useMutation({
    mutationFn: (payload: ProfileUpdateRequest) => UserService.updateMyProfile(payload),
    ...options,
  });
};

/**
 * Upload avatar image
 */
export const useUploadAvatarMutation = (
  options?: Omit<
    UseMutationOptions<AvatarUploadResponse, Error, File, unknown>,
    'mutationFn'
  >
) => {
  return useMutation({
    mutationFn: (file: File) => UserService.uploadAvatar(file),
    ...options,
  });
};

/**
 * Get public profile by username
 */
export const useGetPublicProfileQuery = (
  username: string,
  options?: Omit<UseQueryOptions<PublicProfileResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<PublicProfileResponse, Error>({
    queryKey: [KEYS.USER_BY_USERNAME(username), username],
    queryFn: () => UserService.getPublicProfile(username),
    enabled: !!username,
    ...options,
  });
};

/**
 * Get user statistics by username
 */
export const useGetUserStatsQuery = (
  username: string,
  options?: Omit<UseQueryOptions<UserStatsResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<UserStatsResponse, Error>({
    queryKey: [KEYS.USER_STATS(username), username],
    queryFn: () => UserService.getUserStats(username),
    enabled: !!username,
    ...options,
  });
};

/**
 * Get all users (admin only)
 */
export const useGetAllUsersQuery = (
  options?: Omit<UseQueryOptions<AdminUser[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<AdminUser[], Error>({
    queryKey: [KEYS.ADMIN_USERS],
    queryFn: () => UserService.getAllUsers(),
    staleTime: 0, // Always consider data stale to allow refetch
    refetchOnMount: 'always', // Always refetch when component mounts
    ...options,
  });
};

/**
 * Ban a user (admin only)
 */
export const useBanUserMutation = (
  options?: Omit<UseMutationOptions<void, Error, string, unknown>, 'mutationFn'>
) => {
  return useMutation({
    mutationFn: (userId: string) => UserService.banUser(userId),
    ...options,
  });
};

/**
 * Unban a user (admin only)
 */
export const useUnbanUserMutation = (
  options?: Omit<UseMutationOptions<void, Error, string, unknown>, 'mutationFn'>
) => {
  return useMutation({
    mutationFn: (userId: string) => UserService.unbanUser(userId),
    ...options,
  });
};

/**
 * Delete a user (admin only)
 */
export const useDeleteUserMutation = (
  options?: Omit<UseMutationOptions<void, Error, { userId: string; hardDelete?: boolean }, unknown>, 'mutationFn'>
) => {
  return useMutation({
    mutationFn: ({ userId, hardDelete = false }: { userId: string; hardDelete?: boolean }) =>
      UserService.deleteUser(userId, hardDelete),
    ...options,
  });
};


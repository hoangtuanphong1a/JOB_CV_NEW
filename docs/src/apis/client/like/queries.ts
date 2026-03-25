import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';

import { KEYS } from './keys';
import { LikeService } from './requests';
import {
  LikeActionResponse,
  LikeListParams,
  LikeListResponse,
  LikeSummaryParams,
  LikeSummaryResponse,
} from './types';

export const usePostLikeSummaryQuery = (
  postId?: string,
  params?: LikeSummaryParams,
  options?: Omit<UseQueryOptions<LikeSummaryResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<LikeSummaryResponse, Error>({
    queryKey: [KEYS.LIKE_SUMMARY, postId, params?.recent_limit],
    queryFn: () => {
      if (!postId) {
        throw new Error('postId is required');
      }
      return LikeService.getPostLikeSummary(postId, params);
    },
    enabled: Boolean(postId) && (options?.enabled ?? true),
    staleTime: 1000 * 30,
    ...options,
  });
};

export const usePostLikesQuery = (
  postId?: string,
  params?: LikeListParams,
  options?: Omit<UseQueryOptions<LikeListResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<LikeListResponse, Error>({
    queryKey: [KEYS.LIKE_LIST, postId, params],
    queryFn: () => {
      if (!postId) {
        throw new Error('postId is required');
      }
      return LikeService.getPostLikes(postId, params);
    },
    enabled: Boolean(postId) && (options?.enabled ?? true),
    ...options,
  });
};

export const useLikePostMutation = (
  options?: Omit<UseMutationOptions<LikeActionResponse, Error, string>, 'mutationFn'>
) => {
  return useMutation<LikeActionResponse, Error, string>({
    mutationFn: (postId: string) => LikeService.likePost(postId),
    ...options,
  });
};

export const useUnlikePostMutation = (
  options?: Omit<UseMutationOptions<LikeActionResponse, Error, { postId: string; targetUserId?: string }, unknown>, 'mutationFn'>
) => {
  return useMutation<LikeActionResponse, Error, { postId: string; targetUserId?: string }>({
    mutationFn: ({ postId, targetUserId }: { postId: string; targetUserId?: string }) => 
      LikeService.unlikePost(postId, targetUserId),
    ...options,
  });
};



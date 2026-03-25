import { request } from '../../axios';
import { KEYS } from './keys';
import {
  LikeActionResponse,
  LikeListParams,
  LikeListResponse,
  LikeSummaryParams,
  LikeSummaryResponse,
} from './types';

export const LikeService = {
  likePost: async (postId: string): Promise<LikeActionResponse> => {
    // Interceptor đã trả về response.data
    return (await request.post<LikeActionResponse>(KEYS.likeActionPath(postId))) as unknown as LikeActionResponse;
  },

  unlikePost: async (postId: string, targetUserId?: string): Promise<LikeActionResponse> => {
    // Interceptor đã trả về response.data
    const params = targetUserId ? { target_user_id: targetUserId } : undefined;
    return (await request.delete<LikeActionResponse>(KEYS.likeActionPath(postId), { params })) as unknown as LikeActionResponse;
  },

  getPostLikeSummary: async (
    postId: string,
    params?: LikeSummaryParams
  ): Promise<LikeSummaryResponse> => {
    // Interceptor đã trả về response.data
    return (await request.get<LikeSummaryResponse>(KEYS.likeActionPath(postId), {
      params: params?.recent_limit ? { recent_limit: params.recent_limit } : undefined,
    })) as unknown as LikeSummaryResponse;
  },

  getPostLikes: async (postId: string, params?: LikeListParams): Promise<LikeListResponse> => {
    // Interceptor đã trả về response.data
    return (await request.get<LikeListResponse>(KEYS.likesListPath(postId), {
      params,
    })) as unknown as LikeListResponse;
  },
};



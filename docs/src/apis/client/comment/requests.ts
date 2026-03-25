import { request } from '../../axios';
import { KEYS } from './keys';
import { CommentListParams, CommentListResponse, CommentEntity, CreateCommentPayload } from './types';

export const CommentService = {
  getComments: async (postId: string, params?: CommentListParams): Promise<CommentListResponse> => {
    // Interceptor đã trả về response.data
    return (await request.get<CommentListResponse>(KEYS.postCommentsPath(postId), {
      params,
    })) as unknown as CommentListResponse;
  },

  createComment: async (postId: string, payload: CreateCommentPayload): Promise<CommentEntity> => {
    // Interceptor đã trả về response.data
    return (await request.post<CommentEntity>(KEYS.postCommentsPath(postId), payload)) as unknown as CommentEntity;
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await request.delete(KEYS.commentPath(commentId));
  },
};



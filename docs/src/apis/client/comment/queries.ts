import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { KEYS } from './keys';
import { CommentService } from './requests';
import { CommentEntity, CommentListParams, CommentListResponse, CreateCommentPayload } from './types';

type CreateCommentVariables = {
  postId: string;
  payload: CreateCommentPayload;
};

export const useGetCommentsQuery = (
  postId: string,
  params?: CommentListParams,
  options?: Omit<UseQueryOptions<CommentListResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  const { enabled, ...rest } = options ?? {};

  return useQuery<CommentListResponse, Error>({
    queryKey: [KEYS.COMMENT_QUERY_KEY, postId, params],
    queryFn: () => CommentService.getComments(postId, params),
    enabled: Boolean(postId) && (enabled ?? true),
    ...rest,
  });
};

export const useCreateCommentMutation = (
  options?: Omit<UseMutationOptions<CommentEntity, Error, CreateCommentVariables, unknown>, 'mutationFn'>
) => {
  return useMutation({
    mutationFn: ({ postId, payload }: CreateCommentVariables) => CommentService.createComment(postId, payload),
    ...options,
  });
};

export const useDeleteCommentMutation = (
  options?: Omit<UseMutationOptions<void, Error, string, unknown>, 'mutationFn'>
) => {
  return useMutation({
    mutationFn: (commentId: string) => CommentService.deleteComment(commentId),
    ...options,
  });
};



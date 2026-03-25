import { useInfiniteQuery, useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { KEYS } from './keys';
import { BlogService } from './requests';
import { GetBlogsParams, IComment, ICommentRequest, IMyPost, IPost, IPostRequest, IPostUpdateRequest, PostListResponseData } from './types';

export const useGetBlogQuery = (
  params?: GetBlogsParams,
  options?: Omit<UseQueryOptions<PostListResponseData, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<PostListResponseData, Error>({
    queryKey: [KEYS.BLOG, params], 
    queryFn: () => BlogService.getBlog(params),
    ...options,
  });
};

export const useGetBlogInfiniteQuery = (
  params?: Omit<GetBlogsParams, 'page' | 'limit'>,
  options?: {
    limit?: number;
  }
) => {
  const limit = options?.limit || 10;

  return useInfiniteQuery<PostListResponseData, Error>({
    queryKey: [KEYS.BLOG, 'infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      BlogService.getBlog({
        ...params,
        page: pageParam as number,
        limit,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = (lastPage.meta.current_page || 1) + 1;
      return lastPage.meta.total_pages >= nextPage ? nextPage : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 phút
    refetchOnWindowFocus: false,
  });
};

export const useGetMyBlogQuery = (options?: Omit<UseQueryOptions<IMyPost[], Error>, 'queryKey'>) => {
  return useQuery<IMyPost[], Error>({
    queryKey: [KEYS.BLOG_MY_BLOG],
    queryFn: BlogService.getMyBlog,
    ...options,
  });
};

export const useGetBlogBySlugQuery = (slug: string, options?: Omit<UseQueryOptions<IPost, Error>, 'queryKey'>) => {
  return useQuery<IPost, Error>({
    queryKey: [KEYS.BLOG_SLUG, slug],
    queryFn: () => BlogService.getBlogBySlug(slug),
    ...options,
  });
};

export const useGetBlogWithCommentQuery = (
  id: string,
  options?: Omit<UseQueryOptions<IComment[], Error>, 'queryKey'>
) => {
  return useQuery<IComment[], Error>({
    queryKey: [KEYS.BLOG_WITH_COMMENT, id],
    queryFn: () => BlogService.getBlogWithComment(id),
    ...options,
  });
};

export const useCreatePostMutation = (
  options?: Omit<UseMutationOptions<IPost, Error, IPostRequest, unknown>, 'mutationFn'>
) => {
  return useMutation({
    mutationFn: BlogService.createPost,
    ...options,
  });
};

export const useUpdatePostMutation = (
  options?: Omit<UseMutationOptions<IPost, Error, IPostUpdateRequest, unknown>, 'mutationFn'>
) => {
  return useMutation({
    mutationFn: BlogService.updatePost,
    ...options,
  });
};

export const useCreateCommentMutation = (
  options?: Omit<UseMutationOptions<IComment[], Error, ICommentRequest, unknown>, 'mutationFn'>
) => {
  return useMutation({
    mutationFn: BlogService.createComment,
    ...options,
  });
};

export const useUploadImageMutation = (
  options?: Omit<UseMutationOptions<{ uploaded: boolean; url: string }, Error, File, unknown>, 'mutationFn'>
) => {
  return useMutation({
    mutationFn: BlogService.uploadImage,
    ...options,
  });
};

export const useAddCommentLikeMutation = (
  options?: Omit<UseMutationOptions<void, Error, string, unknown>, 'mutationFn'>
) => {
  return useMutation({
    mutationFn: BlogService.addCommentLike,
    ...options,
  });
};

export const useAddCommentDislikeMutation = (
  options?: Omit<UseMutationOptions<void, Error, string, unknown>, 'mutationFn'>
) => {
  return useMutation({
    mutationFn: BlogService.addCommentDislike,
    ...options,
  });
};

export const useDeletePostMutation = (
  options?: Omit<UseMutationOptions<void, Error, string, unknown>, 'mutationFn'>
) => {
  return useMutation({
    mutationFn: (id: string) => BlogService.deletePost(id),
    ...options,
  });
};

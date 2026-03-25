/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from '../../axios';
import { KEYS } from './keys';
import { GetBlogsParams, IComment, ICommentRequest, IMyPost, IPost, IPostRequest, IPostUpdateRequest, PostListResponseData } from './types';

export const BlogService = {
  getBlog: async (params?: GetBlogsParams): Promise<PostListResponseData> => {
    const { data } = await request.get(KEYS.BLOG, { params });

    return data
  },

  getBlogWithComment: async (id: string): Promise<IComment[]> => {
    const { data } = await request.get(`${KEYS.BLOG_WITH_COMMENT}/?id=${id}`);

    return data.comments;
  },

  getBlogBySlug: async (slug: string): Promise<IPost> => {
    const data = (await request.get(
      `${KEYS.BLOG_SLUG}/${slug}`
    )) as unknown as IPost;
    return data;
  },


  getMyBlog: async (): Promise<IMyPost[]> => {
    const { data } = await request.get(KEYS.BLOG_MY_BLOG);

    return data.blogs;
  },

  createPost: async (payload: IPostRequest): Promise<IPost> => {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('body', payload.body);
    formData.append('published', payload.published.toString());
    formData.append('image', payload.image);
    formData.append('excerpt', payload.excerpt);
    payload.tags.forEach((tag) => formData.append('Tags', tag));

    const { data } = await request.post(KEYS.BLOG_CREATE, formData);

    return data;
  },

  updatePost: async (payload: IPostUpdateRequest): Promise<IPost> => {
    const formData = new FormData();
    formData.append('Id', payload.Id);
    formData.append('title', payload.title);
    formData.append('body', payload.body);
    formData.append('published', payload.published.toString());
    formData.append('excerpt', payload.excerpt);
    payload.tags.forEach((tag) => formData.append('Tags', tag));
    
    // Only append image if a new image is provided (IImage)
    if (payload.IImage) {
      formData.append('image', payload.IImage);
    }

    const { data } = await request.put(`${KEYS.BLOG}/${payload.Id}`, formData);

    return data;
  },

  uploadImage: async (image: File): Promise<{ uploaded: boolean; url: string }> => {
    const formData = new FormData();
    formData.append('IImage', image);

    const data = await request.post(KEYS.BLOG_IMAGE, formData);

    return data as any;
  },

  createComment: async (payload: ICommentRequest): Promise<IComment[]> => {
    const { data } = await request.post(KEYS.POST_COMMENT, payload);

    return data;
  },

  addCommentLike: async (id: string): Promise<void> => {
    const { data } = await request.put(`${KEYS.POST_COMMENT_LIKE}/${id}`);

    return data;
  },

  addCommentDislike: async (id: string): Promise<void> => {
    const { data } = await request.put(`${KEYS.POST_COMMENT_DISLIKE}/${id}`);

    return data;
  },

  deletePost: async (id: string): Promise<void> => {
    await request.delete(`${KEYS.BLOG}/${id}`);
  },
};

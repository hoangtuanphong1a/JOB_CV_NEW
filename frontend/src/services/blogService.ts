import { api } from './api';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  featuredImage?: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
}

export interface CreateBlogPostData {
  title: string;
  content: string;
  excerpt?: string;
  categoryId: string;
  tagIds?: string[];
  featuredImage?: string;
  status: 'draft' | 'published';
  publishedAt?: string;
}

export class BlogService {
  static async getPosts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    author?: string;
    search?: string;
    status?: string;
  }): Promise<{ data: BlogPost[]; total: number; page: number; limit: number }> {
    const response = await api.get('/blog/posts', { params });
    return response.data;
  }

  static async getPost(slug: string): Promise<BlogPost> {
    const response = await api.get(`/blog/posts/${slug}`);
    return response.data;
  }

  static async getPostById(id: string): Promise<BlogPost> {
    const response = await api.get(`/blog/posts/id/${id}`);
    return response.data;
  }

  static async createPost(data: CreateBlogPostData): Promise<BlogPost> {
    const response = await api.post('/blog/posts', data);
    return response.data;
  }

  static async updatePost(id: string, data: Partial<CreateBlogPostData>): Promise<BlogPost> {
    const response = await api.put(`/blog/posts/${id}`, data);
    return response.data;
  }

  static async deletePost(id: string): Promise<void> {
    await api.delete(`/blog/posts/${id}`);
  }

  static async getCategories(): Promise<BlogCategory[]> {
    const response = await api.get('/blog/categories');
    return response.data;
  }

  static async getTags(): Promise<{ id: string; name: string; slug: string; postCount: number }[]> {
    const response = await api.get('/blog/tags');
    return response.data;
  }

  static async likePost(postId: string): Promise<void> {
    await api.post(`/blog/posts/${postId}/like`);
  }

  static async unlikePost(postId: string): Promise<void> {
    await api.delete(`/blog/posts/${postId}/like`);
  }

  static async addComment(postId: string, content: string): Promise<{ id: string; content: string; author: { id: string; name: string; avatar?: string }; createdAt: string }> {
    const response = await api.post(`/blog/posts/${postId}/comments`, { content });
    return response.data;
  }

  static async getComments(postId: string, params?: { page?: number; limit?: number }): Promise<{ data: Array<{ id: string; content: string; author: { id: string; name: string; avatar?: string }; createdAt: string }>; total: number }> {
    const response = await api.get(`/blog/posts/${postId}/comments`, { params });
    return response.data;
  }

  static async getPopularPosts(limit: number = 5): Promise<BlogPost[]> {
    const response = await api.get('/blog/posts/popular', { params: { limit } });
    return response.data;
  }

  static async getRelatedPosts(postId: string, limit: number = 3): Promise<BlogPost[]> {
    const response = await api.get(`/blog/posts/${postId}/related`, { params: { limit } });
    return response.data;
  }

  static async searchPosts(query: string, params?: { page?: number; limit?: number }): Promise<{ data: BlogPost[]; total: number }> {
    const response = await api.get('/blog/search', {
      params: { q: query, ...params }
    });
    return response.data;
  }
}

export default BlogService;

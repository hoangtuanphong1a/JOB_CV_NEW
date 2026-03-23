import { api } from './api';

export interface SavedBlog {
  id: string;
  blogPostId: string;
  userId: string;
  savedAt: string;
  blogPost?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage?: string;
    publishedAt?: string;
    author: {
      id: string;
      firstName: string;
      lastName: string;
    };
    category: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export interface SavedBlogWithDetails extends SavedBlog {
  blogPost: NonNullable<SavedBlog['blogPost']>;
}

export class SavedBlogsService {
  static async saveBlogPost(blogPostId: string): Promise<SavedBlog> {
    const response = await api.post(`/saved-blogs/${blogPostId}`);
    return response.data;
  }

  static async getSavedBlogs(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<{ data: SavedBlogWithDetails[]; total: number; page: number; limit: number }> {
    const response = await api.get('/saved-blogs', { params });
    return response.data;
  }

  static async getSavedBlog(id: string): Promise<SavedBlogWithDetails> {
    const response = await api.get(`/saved-blogs/${id}`);
    return response.data;
  }

  static async unsaveBlogPost(blogPostId: string): Promise<void> {
    await api.delete(`/saved-blogs/${blogPostId}`);
  }

  static async unsaveBlogPostById(id: string): Promise<void> {
    await api.delete(`/saved-blogs/${id}`);
  }

  static async checkBlogPostSaved(blogPostId: string): Promise<{ isSaved: boolean; savedBlog?: SavedBlog }> {
    const response = await api.get(`/saved-blogs/blog/${blogPostId}/check`);
    return response.data;
  }

  static async getSavedBlogsByCategory(categoryId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<{ data: SavedBlogWithDetails[]; total: number }> {
    const response = await api.get(`/saved-blogs/category/${categoryId}`, { params });
    return response.data;
  }

  static async getSavedBlogsStats(): Promise<{
    totalSaved: number;
    thisWeekSaved: number;
    mostSavedCategory: {
      categoryId: string;
      categoryName: string;
      count: number;
    };
    recentlySaved: SavedBlogWithDetails[];
  }> {
    const response = await api.get('/saved-blogs/stats');
    return response.data;
  }

  static async exportSavedBlogs(params?: {
    format?: 'csv' | 'json' | 'pdf';
    category?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> {
    const response = await api.get('/saved-blogs/export', {
      params,
      responseType: 'blob'
    });
    return response.data;
  }

  static async bulkUnsave(blogPostIds: string[]): Promise<{
    successful: string[];
    failed: string[];
  }> {
    const response = await api.post('/saved-blogs/bulk-unsave', { blogPostIds });
    return response.data;
  }

  static async organizeSavedBlogs(data: {
    folderName: string;
    blogPostIds: string[];
  }): Promise<{
    folderId: string;
    folderName: string;
    savedBlogs: SavedBlogWithDetails[];
  }> {
    const response = await api.post('/saved-blogs/organize', data);
    return response.data;
  }
}

export default SavedBlogsService;

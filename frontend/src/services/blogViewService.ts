import { api } from './api';

export interface BlogView {
  id: string;
  blogPostId: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  viewedAt: string;
  sessionId?: string;
  country?: string;
  city?: string;
}

export interface BlogViewStats {
  blogPostId: string;
  totalViews: number;
  uniqueViews: number;
  todayViews: number;
  weekViews: number;
  monthViews: number;
  topCountries: Array<{
    country: string;
    views: number;
  }>;
  topReferrers: Array<{
    referrer: string;
    views: number;
  }>;
  viewTrends: Array<{
    date: string;
    views: number;
  }>;
}

export interface BlogAnalytics {
  totalViews: number;
  totalUniqueViews: number;
  totalPosts: number;
  averageViewsPerPost: number;
  topPosts: Array<{
    postId: string;
    title: string;
    views: number;
    uniqueViews: number;
  }>;
  viewsByCategory: Array<{
    categoryId: string;
    categoryName: string;
    views: number;
    percentage: number;
  }>;
  viewsTrend: Array<{
    date: string;
    views: number;
    uniqueViews: number;
  }>;
  topReferrers: Array<{
    referrer: string;
    views: number;
    percentage: number;
  }>;
  geographicData: Array<{
    country: string;
    views: number;
    percentage: number;
  }>;
}

export class BlogViewService {
  static async trackView(blogPostId: string): Promise<BlogView> {
    const response = await api.post(`/blog-views/${blogPostId}`);
    return response.data;
  }

  static async getBlogViewStats(blogPostId: string): Promise<BlogViewStats> {
    const response = await api.get(`/blog-views/${blogPostId}/stats`);
    return response.data;
  }

  static async getBlogAnalyticsOverview(): Promise<BlogAnalytics> {
    const response = await api.get('/blog-views/analytics/overview');
    return response.data;
  }

  static async getBlogAnalyticsTrends(params?: {
    startDate?: string;
    endDate?: string;
    period?: 'day' | 'week' | 'month';
  }): Promise<{
    trends: Array<{
      date: string;
      views: number;
      uniqueViews: number;
      newPosts: number;
    }>;
    summary: {
      totalViews: number;
      totalUniqueViews: number;
      growthPercentage: number;
    };
  }> {
    const response = await api.get('/blog-views/analytics/trends', { params });
    return response.data;
  }

  static async getTopPerformingPosts(limit: number = 10, period?: 'today' | 'week' | 'month' | 'all'): Promise<Array<{
    postId: string;
    title: string;
    slug: string;
    views: number;
    uniqueViews: number;
    averageTimeOnPage?: number;
    bounceRate?: number;
    publishedAt: string;
  }>> {
    const response = await api.get('/blog-views/analytics/top-posts', {
      params: { limit, period }
    });
    return response.data;
  }

  static async getRealTimeStats(): Promise<{
    activeUsers: number;
    currentViews: number;
    todayViews: number;
    yesterdayViews: number;
    growthPercentage: number;
  }> {
    const response = await api.get('/blog-views/analytics/realtime');
    return response.data;
  }

  static async exportAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    format?: 'csv' | 'excel' | 'pdf';
  }): Promise<Blob> {
    const response = await api.get('/blog-views/analytics/export', {
      params,
      responseType: 'blob'
    });
    return response.data;
  }

  static async getCustomAnalytics(query: {
    startDate?: string;
    endDate?: string;
    postIds?: string[];
    categoryIds?: string[];
    groupBy?: 'day' | 'week' | 'month' | 'category' | 'post';
    metrics?: string[];
  }): Promise<{
    data: unknown[];
    summary: Record<string, unknown>;
    metadata: {
      totalRecords: number;
      queryTime: number;
      filters: Record<string, unknown>;
    };
  }> {
    const response = await api.post('/blog-views/analytics/custom', query);
    return response.data;
  }
}

export default BlogViewService;

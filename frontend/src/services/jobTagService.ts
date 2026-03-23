import { api } from './api';

export interface JobTag {
  id: string;
  name: string;
  description?: string;
  color?: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobTagData {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateJobTagData {
  name?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

export class JobTagService {
  static async getJobTags(): Promise<JobTag[]> {
    const response = await api.get('/job-tags');
    return response.data;
  }

  static async createJobTag(data: CreateJobTagData): Promise<JobTag> {
    const response = await api.post('/job-tags', data);
    return response.data;
  }

  static async getJobTag(id: string): Promise<JobTag> {
    const response = await api.get(`/job-tags/${id}`);
    return response.data;
  }

  static async updateJobTag(id: string, data: UpdateJobTagData): Promise<JobTag> {
    const response = await api.put(`/job-tags/${id}`, data);
    return response.data;
  }

  static async deleteJobTag(id: string): Promise<void> {
    await api.delete(`/job-tags/${id}`);
  }

  static async searchJobTags(query: string): Promise<JobTag[]> {
    const response = await api.get('/job-tags/search', {
      params: { q: query }
    });
    return response.data;
  }

  static async getPopularJobTags(limit: number = 10): Promise<JobTag[]> {
    const response = await api.get('/job-tags/popular', {
      params: { limit }
    });
    return response.data;
  }

  static async getJobTagStats(): Promise<{
    totalTags: number;
    activeTags: number;
    totalUsage: number;
    topTags: JobTag[];
  }> {
    const response = await api.get('/job-tags/stats');
    return response.data;
  }
}

export default JobTagService;

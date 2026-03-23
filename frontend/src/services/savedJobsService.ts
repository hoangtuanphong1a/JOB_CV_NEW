import { api } from './api';
import { Job } from './jobService';

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  job: Job;
  savedAt: string;
  notes?: string;
}

export class SavedJobsService {
  static async getSavedJobs(params?: { page?: number; limit?: number }): Promise<{ data: SavedJob[]; total: number }> {
    const response = await api.get('/saved-jobs', { params });
    return response.data;
  }

  static async saveJob(jobId: string, notes?: string): Promise<SavedJob> {
    const response = await api.post(`/saved-jobs/${jobId}`, { notes });
    return response.data;
  }

  static async unsaveJob(jobId: string): Promise<void> {
    await api.delete(`/saved-jobs/job/${jobId}`);
  }

  static async isJobSaved(jobId: string): Promise<{ isSaved: boolean; savedJob?: SavedJob }> {
    const response = await api.get(`/saved-jobs/job/${jobId}/check`);
    return response.data;
  }

  static async updateSavedJobNotes(jobId: string, notes: string): Promise<SavedJob> {
    const response = await api.put(`/saved-jobs/${jobId}/notes`, { notes });
    return response.data;
  }

  static async getSavedJobsByCategory(): Promise<{ category: string; jobs: SavedJob[] }[]> {
    const response = await api.get('/saved-jobs/by-category');
    return response.data;
  }

  static async getSavedJobsStats(): Promise<{
    totalSaved: number;
    recentSaves: number;
    appliedFromSaved: number;
  }> {
    const response = await api.get('/saved-jobs/stats');
    return response.data;
  }

  static async shareSavedJobs(email: string, jobIds: string[]): Promise<void> {
    await api.post('/saved-jobs/share', { email, jobIds });
  }

  static async exportSavedJobs(): Promise<Blob> {
    const response = await api.get('/saved-jobs/export', {
      responseType: 'blob'
    });
    return response.data;
  }
}

export default SavedJobsService;

import { api } from './api';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  summary?: string;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
  isCurrent: boolean;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface CVData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
}

export interface CV {
  id: string;
  userId: string;
  data: CVData;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export class CVService {
  static async getMyCVs(): Promise<CV[]> {
    const response = await api.get('/cv/user/my-cvs');
    return response.data;
  }

  static async getCV(cvId: string): Promise<CV> {
    const response = await api.get(`/cv/${cvId}`);
    return response.data;
  }

  static async createCV(cvData: CVData): Promise<CV> {
    const response = await api.post('/cv', cvData);
    return response.data;
  }

  static async updateCV(cvId: string, cvData: CVData): Promise<CV> {
    const response = await api.put(`/cv/${cvId}`, cvData);
    return response.data;
  }

  static async deleteCV(cvId: string): Promise<void> {
    await api.delete(`/cv/${cvId}`);
  }

  static async saveCV(cvData: CVData): Promise<CV> {
    const response = await api.post('/cv/save', cvData);
    return response.data;
  }

  static async downloadCV(cvData: CVData): Promise<Blob> {
    const response = await api.post('/cv/download', cvData, {
      responseType: 'blob'
    });
    return response.data;
  }

  static async getPublicCVs(params?: { page?: number; limit?: number; search?: string }): Promise<{ data: CV[]; total: number }> {
    const response = await api.get('/cv/public', { params });
    return response.data;
  }

  static async makeCVPublic(cvId: string): Promise<void> {
    await api.post(`/cv/${cvId}/public`);
  }

  static async makeCVPrivate(cvId: string): Promise<void> {
    await api.delete(`/cv/${cvId}/public`);
  }

  static async uploadCVFile(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('cv', file);

    const response = await api.post('/cv/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  static async getCVTemplate(templateId: string): Promise<CVData> {
    const response = await api.get(`/cv/templates/${templateId}`);
    return response.data;
  }

  static async getCVTemplates(): Promise<{ id: string; name: string; description: string; preview: string }[]> {
    const response = await api.get('/cv/templates');
    return response.data;
  }

  static async analyzeCV(cvData: CVData): Promise<{ score: number; suggestions: string[]; keywords: string[] }> {
    const response = await api.post('/cv/analyze', cvData);
    return response.data;
  }
}

export default CVService;

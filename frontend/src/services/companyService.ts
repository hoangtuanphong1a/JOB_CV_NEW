import { api } from './api';
import { Job } from './jobService';

export interface Company {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logo?: string;
  banner?: string;
  industry?: string;
  size?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  status: 'active' | 'inactive' | 'pending';
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyData {
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
}

export class CompanyService {
  static async getCompanies(params?: {
    page?: number;
    limit?: number;
    search?: string;
    industry?: string;
  }): Promise<{ data: Company[]; total: number; page: number; limit: number }> {
    const response = await api.get('/companies', { params });
    return response.data;
  }

  static async getCompany(id: string): Promise<Company> {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  }

  static async createCompany(data: CreateCompanyData): Promise<Company> {
    const response = await api.post('/companies', data);
    return response.data;
  }

  static async updateCompany(id: string, data: Partial<CreateCompanyData>): Promise<Company> {
    const response = await api.put(`/companies/${id}`, data);
    return response.data;
  }

  static async deleteCompany(id: string): Promise<void> {
    await api.delete(`/companies/${id}`);
  }

  static async getUserCompanies(): Promise<Company[]> {
    const response = await api.get('/companies/user/my-companies');
    return response.data;
  }

  static async followCompany(companyId: string): Promise<void> {
    await api.post(`/companies/${companyId}/follow`);
  }

  static async unfollowCompany(companyId: string): Promise<void> {
    await api.delete(`/companies/${companyId}/follow`);
  }

  static async getCompanyJobs(companyId: string, params?: { page?: number; limit?: number }): Promise<{ data: Job[]; total: number; page: number; limit: number }> {
    const response = await api.get(`/companies/${companyId}/jobs`, { params });
    return response.data;
  }

  static async getCompanyStats(companyId: string): Promise<{ totalJobs: number; activeJobs: number; totalApplications: number; hiredCount: number }> {
    const response = await api.get(`/companies/${companyId}/stats`);
    return response.data;
  }

  static async uploadCompanyLogo(companyId: string, file: File): Promise<{ logoUrl: string }> {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await api.post(`/companies/${companyId}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  static async uploadCompanyBanner(companyId: string, file: File): Promise<{ bannerUrl: string }> {
    const formData = new FormData();
    formData.append('banner', file);

    const response = await api.post(`/companies/${companyId}/banner`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export default CompanyService;

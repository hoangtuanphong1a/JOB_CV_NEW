import { api } from './api';
import { User } from './authService';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  city?: string;
  country?: string;
  preferredLocale?: string;
  bio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

export interface JobSeekerProfile extends User {
  title?: string;
  summary?: string;
  experience?: number;
  skills?: string[];
  resumeUrl?: string;
  isPublicProfile?: boolean;
  currentSalary?: number;
  expectedSalary?: number;
  availability?: 'immediately' | '2_weeks' | '1_month' | '3_months';
}

export interface EmployerProfile extends User {
  company?: {
    id: string;
    name: string;
    position: string;
    department?: string;
  };
  industry?: string;
  yearsOfExperience?: number;
}

export class UserService {
  static async getProfile(): Promise<User> {
    const response = await api.get('/users/profile');
    return response.data;
  }

  static async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.put('/users/profile', data);
    return response.data;
  }

  static async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  static async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await api.post('/users/change-password', data);
  }

  static async deleteAccount(): Promise<void> {
    await api.delete('/users/account');
  }

  // Job Seeker specific methods
  static async getJobSeekerProfile(): Promise<JobSeekerProfile> {
    const response = await api.get('/users/job-seeker/profile');
    return response.data;
  }

  static async updateJobSeekerProfile(data: Partial<JobSeekerProfile>): Promise<JobSeekerProfile> {
    const response = await api.put('/users/job-seeker/profile', data);
    return response.data;
  }

  static async uploadResume(file: File): Promise<{ resumeUrl: string }> {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await api.post('/users/job-seeker/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Employer specific methods
  static async getEmployerProfile(): Promise<EmployerProfile> {
    const response = await api.get('/users/employer/profile');
    return response.data;
  }

  static async updateEmployerProfile(data: Partial<EmployerProfile>): Promise<EmployerProfile> {
    const response = await api.put('/users/employer/profile', data);
    return response.data;
  }

  // Admin methods
  static async getAllUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }): Promise<{ data: User[]; total: number }> {
    const response = await api.get('/users/admin/users', { params });
    return response.data;
  }

  static async updateUserStatus(userId: string, status: 'active' | 'inactive' | 'suspended'): Promise<void> {
    await api.put(`/users/admin/users/${userId}/status`, { status });
  }

  static async deleteUser(userId: string): Promise<void> {
    await api.delete(`/users/admin/users/${userId}`);
  }

  // General methods
  static async searchUsers(query: string, role?: string): Promise<User[]> {
    const response = await api.get('/users/search', {
      params: { q: query, role }
    });
    return response.data;
  }

  static async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    usersByRole: Record<string, number>;
  }> {
    const response = await api.get('/users/stats');
    return response.data;
  }
}

export default UserService;

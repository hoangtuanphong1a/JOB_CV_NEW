import { api } from './api';

export interface AdminStats {
  users: {
    total: number;
    active: number;
    newToday: number;
  };
  jobs: {
    total: number;
    active: number;
    newToday: number;
  };
  companies: {
    total: number;
    active: number;
    newToday: number;
  };
  applications: {
    total: number;
    pending: number;
    newToday: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    growth: number;
  };
  system: {
    uptime: number;
    memoryUsage: number;
    diskUsage: number;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  statusReason?: string;
  createdAt: string;
  updatedAt: string;
  userRoles: Array<{
    id: string;
    role: {
      id: string;
      name: string;
    };
  }>;
  company?: {
    id: string;
    name: string;
    status: string;
  };
  jobSeekerProfile?: {
    id: string;
    user: User;
    skills: Skill[];
  };
  applications?: Application[];
  statistics?: {
    totalApplications: number;
    totalJobsPosted: number;
    activeJobs: number;
  };
}

export interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  salaryMin?: number;
  salaryMax?: number;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  postedById: string;
  company: {
    id: string;
    name: string;
    logo?: string;
    status: string;
  };
  applications: Application[];
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logo?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  jobSeekerProfile: {
    id: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  job: {
    id: string;
    title: string;
    company: {
      id: string;
      name: string;
    };
  };
}

export interface Skill {
  id: string;
  name: string;
  description?: string;
  category?: string;
  createdAt: string;
  usageCount?: number;
}

export interface JobCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  usageCount?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardCharts {
  userRegistrations: Array<{
    date: string;
    count: number;
  }>;
  jobPostings: Array<{
    date: string;
    count: number;
  }>;
  applications: Array<{
    date: string;
    count: number;
  }>;
  period: string;
}

export interface SystemInfo {
  version: string;
  uptime: number;
  memory: {
    used: number;
    total: number;
    external: number;
  };
  database: {
    status: string;
    connectionPool: string;
  };
  environment: string;
  platform: {
    nodeVersion: string;
    platform: string;
    arch: string;
    cpus: number;
  };
}

export interface SystemLog {
  timestamp: string;
  level: string;
  message: string;
  source: string;
}

export interface UserActivityReport {
  data: Array<{
    date: string;
    registrations: number;
  }>;
  startDate: string;
  endDate: string;
}

export interface JobMarketReport {
  jobsByCategory: Array<{
    categoryName: string;
    count: number;
  }>;
  applicationsPerJob: Array<{
    jobTitle: string;
    applicationCount: number;
  }>;
  startDate: string;
  endDate: string;
}

export interface RevenueReport {
  data: Array<{
    date: string;
    revenue: number;
    transactions: number;
  }>;
  startDate: string;
  endDate: string;
  groupBy: string;
}

class AdminService {
  // ===== DASHBOARD =====
  async getDashboardOverview(): Promise<AdminStats> {
    const response = await api.get('/admin/dashboard/overview');
    return response.data;
  }

  async getDashboardCharts(period: string = '30d'): Promise<DashboardCharts> {
    const response = await api.get('/admin/dashboard/charts', {
      params: { period }
    });
    return response.data;
  }

  // ===== USER MANAGEMENT =====
  async createUser(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role: 'job-seeker' | 'employer' | 'admin';
  }): Promise<User> {
    const response = await api.post('/admin/users', userData);
    return response.data;
  }

  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }): Promise<PaginatedResponse<User>> {
    const response = await api.get('/admin/users', { params });
    return response.data;
  }

  async getUserDetails(id: string): Promise<User> {
    const response = await api.get(`/admin/users/${id}/details`);
    return response.data;
  }

  async updateUserStatus(id: string, status: string, reason?: string): Promise<{ message: string }> {
    const response = await api.put(`/admin/users/${id}/status`, { status, reason });
    return response.data;
  }

  async updateUserRole(id: string, role: string): Promise<{ message: string }> {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  }

  // ===== JOB MANAGEMENT =====
  async getAllJobs(params?: {
    page?: number;
    limit?: number;
    status?: string;
    company?: string;
    search?: string;
  }): Promise<PaginatedResponse<Job>> {
    const response = await api.get('/admin/jobs', { params });
    return response.data;
  }

  async updateJobStatus(id: string, status: string, reason?: string): Promise<{ message: string }> {
    const response = await api.put(`/admin/jobs/${id}/status`, { status, reason });
    return response.data;
  }

  async deleteJob(id: string): Promise<void> {
    await api.delete(`/admin/jobs/${id}`);
  }

  // ===== COMPANY MANAGEMENT =====
  async getAllCompanies(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<PaginatedResponse<Company>> {
    const response = await api.get('/admin/companies', { params });
    return response.data;
  }

  async updateCompanyStatus(id: string, status: string, reason?: string): Promise<{ message: string }> {
    const response = await api.put(`/admin/companies/${id}/status`, { status, reason });
    return response.data;
  }

  async deleteCompany(id: string): Promise<void> {
    await api.delete(`/admin/companies/${id}`);
  }

  // ===== APPLICATION MANAGEMENT =====
  async getAllApplications(params?: {
    page?: number;
    limit?: number;
    status?: string;
    jobId?: string;
    userId?: string;
  }): Promise<PaginatedResponse<Application>> {
    const response = await api.get('/admin/applications', { params });
    return response.data;
  }

  async updateApplicationStatus(id: string, status: string, notes?: string): Promise<{ message: string }> {
    const response = await api.put(`/admin/applications/${id}/status`, { status, notes });
    return response.data;
  }

  // ===== CONTENT MANAGEMENT =====
  async getContentStats(): Promise<{
    totalSkills: number;
    totalCategories: number;
    skillsThisMonth: number;
    categoriesThisMonth: number;
  }> {
    const response = await api.get('/admin/content/stats');
    return response.data;
  }

  async getAllSkills(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Skill>> {
    const response = await api.get('/admin/content/skills', { params });
    return response.data;
  }

  async createSkill(data: { name: string; description?: string; category?: string }): Promise<Skill> {
    const response = await api.post('/admin/content/skills', data);
    return response.data;
  }

  async updateSkill(id: string, data: { name?: string; description?: string; category?: string }): Promise<{ message: string }> {
    const response = await api.put(`/admin/content/skills/${id}`, data);
    return response.data;
  }

  async deleteSkill(id: string): Promise<void> {
    await api.delete(`/admin/content/skills/${id}`);
  }

  async getAllJobCategories(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<JobCategory>> {
    const response = await api.get('/admin/content/job-categories', { params });
    return response.data;
  }

  async createJobCategory(data: { name: string; description?: string }): Promise<JobCategory> {
    const response = await api.post('/admin/content/job-categories', data);
    return response.data;
  }

  async updateJobCategory(id: string, data: { name?: string; description?: string }): Promise<{ message: string }> {
    const response = await api.put(`/admin/content/job-categories/${id}`, data);
    return response.data;
  }

  async deleteJobCategory(id: string): Promise<void> {
    await api.delete(`/admin/content/job-categories/${id}`);
  }

  // ===== SYSTEM MANAGEMENT =====
  async getSystemInfo(): Promise<SystemInfo> {
    const response = await api.get('/admin/system/info');
    return response.data;
  }

  async runMaintenanceTask(task: string): Promise<{ message: string }> {
    const response = await api.post('/admin/system/maintenance', { task });
    return response.data;
  }

  async getSystemLogs(params?: { level?: string; limit?: number }): Promise<{ data: SystemLog[]; total: number }> {
    const response = await api.get('/admin/system/logs', { params });
    return response.data;
  }

  // ===== ANALYTICS & REPORTS =====
  async getUserActivityReport(params?: { startDate?: string; endDate?: string }): Promise<UserActivityReport> {
    const response = await api.get('/admin/reports/user-activity', { params });
    return response.data;
  }

  async getJobMarketReport(params?: { startDate?: string; endDate?: string }): Promise<JobMarketReport> {
    const response = await api.get('/admin/reports/job-market', { params });
    return response.data;
  }

  async getRevenueReport(params?: { startDate?: string; endDate?: string; groupBy?: string }): Promise<RevenueReport> {
    const response = await api.get('/admin/reports/revenue', { params });
    return response.data;
  }
}

export const adminService = new AdminService();

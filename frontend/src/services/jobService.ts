import { api } from "./api";

export interface JobFormData {
  title: string;
  industry: string; // This will map to categoryId
  level: string; // This will map to experienceLevel
  type: string; // This will map to jobType
  quantity: string;
  salaryMin: string;
  salaryMax: string;
  location: string; // This will map to city
  description: string;
  requirements: string;
  benefits: string;
  skills: string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  deadline: string;
  companyId?: string; // This will be determined from user companies
}

export interface CreateJobData {
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  jobType?: string;
  experienceLevel?: string;
  minSalary?: number;
  maxSalary?: number;
  city?: string;
  country?: string;
  skillIds?: string[];
  categoryId?: string;
  companyId: string;
  expiresAt?: string;
}

export interface Skill {
  id: string;
  name: string;
  description?: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
}

export interface JobCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Job {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  urgent: any;
  id: string;
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  jobType?: string;
  experienceLevel?: string;
  status: string;
  salaryType?: string;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  city?: string;
  state?: string;
  country?: string;
  remoteWork?: boolean;
  viewCount: number;
  applicationCount: number;
  createdAt: string;
  expiresAt?: string;
  company?: {
    id: string;
    name: string;
  };
  skills: Array<{
    id: string;
    name: string;
  }>;
  tags: Array<{
    id: string;
    name: string;
  }>;
}

class JobService {
  async createJob(jobData: CreateJobData): Promise<Job> {
    console.log("🔧 jobService.createJob called with data:", jobData);
    console.log("📡 Making API call to POST /jobs...");
    try {
      const response = await api.post("/jobs", jobData);
      console.log("✅ API call successful, response status:", response.status);
      console.log("📋 API response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ API call failed:", error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as any;
      console.error("❌ Error response:", axiosError.response?.data);
      console.error("❌ Error status:", axiosError.response?.status);
      throw error;
    }
  }

  async getUserCompanies(): Promise<Company[]> {
    try {
      const response = await api.get("/companies/user/my-companies");
      return response.data;
    } catch (error) {
      console.warn('Companies API not available:', error);
      // Return empty array if API is not available
      return [];
    }
  }

  async getJobCategories(): Promise<JobCategory[]> {
    try {
      const response = await api.get("/job-categories");
      return response.data;
    } catch (error) {
      console.warn('Job categories API not available:', error);
      // Return mock categories if API is not available
      return [
        { id: '1', name: 'Công nghệ thông tin', description: 'IT and software development' },
        { id: '2', name: 'Marketing', description: 'Marketing and advertising' },
        { id: '3', name: 'Thiết kế', description: 'Design and creative' },
        { id: '4', name: 'Kinh doanh', description: 'Sales and business' },
        { id: '5', name: 'Tài chính', description: 'Finance and accounting' },
        { id: '6', name: 'Nhân sự', description: 'Human resources' }
      ];
    }
  }

  async searchSkills(name: string): Promise<Skill[]> {
    try {
      const response = await api.get(
        `/skills/search?name=${encodeURIComponent(name)}`
      );
      return response.data;
    } catch (error) {
      console.warn('Skills search API not available:', error);
      // Return empty array if API is not available
      return [];
    }
  }

  async getSkillByName(name: string): Promise<Skill | null> {
    try {
      const skills = await this.searchSkills(name);
      return (
        skills.find(
          (skill) => skill.name.toLowerCase() === name.toLowerCase()
        ) || null
      );
    } catch (error) {
      console.error("Error searching for skill:", error);
      return null;
    }
  }

  async getJobs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
    category?: string;
    company?: string;
    status?: string;
  }): Promise<{ data: Job[]; total: number; page: number; limit: number }> {
    const response = await api.get("/jobs", { params });
    return response.data;
  }

  async getJob(jobId: string): Promise<Job> {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  }

  async updateJob(
    jobId: string,
    jobData: Partial<CreateJobData>
  ): Promise<Job> {
    const response = await api.put(`/jobs/${jobId}`, jobData);
    return response.data;
  }

  async deleteJob(jobId: string): Promise<void> {
    await api.delete(`/jobs/${jobId}`);
  }

  async convertSkillNamesToIds(skillNames: string[]): Promise<string[]> {
    const skillIds: string[] = [];

    for (const skillName of skillNames) {
      const trimmedName = skillName.trim();
      if (trimmedName) {
        const skill = await this.getSkillByName(trimmedName);
        if (skill) {
          skillIds.push(skill.id);
        } else {
          console.warn(`Skill "${trimmedName}" not found, skipping`);
        }
      }
    }

    return skillIds;
  }
}

export const jobService = new JobService();

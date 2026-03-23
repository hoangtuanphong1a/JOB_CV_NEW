import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import { Job, JobStatus } from '../common/entities/job.entity';
import {
  Application,
  ApplicationStatus,
} from '../common/entities/application.entity';
import { User } from '../common/entities/user.entity';
import { Company } from '../common/entities/company.entity';

@Injectable()
export class EmployerService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async getDashboardStats(userId: string) {
    // Find companies owned by this user
    const companies = await this.companyRepository.find({
      where: { ownerId: userId },
      select: ['id'],
    });

    const companyIds = companies.map((company) => company.id);

    if (companyIds.length === 0) {
      return {
        activeJobs: 0,
        totalApplications: 0,
        totalViews: 0,
        hiredCount: 0,
        responseRate: 0,
        avgHiringTime: 0,
        qualityApplicants: 0,
      };
    }

    // Get active jobs count
    const activeJobs = await this.jobRepository.count({
      where: {
        companyId: In(companyIds),
        status: JobStatus.PUBLISHED,
      },
    });

    // Get total applications
    const totalApplications = await this.applicationRepository.count({
      where: {
        job: {
          companyId: In(companyIds),
        },
      },
    });

    // Get total views (sum of viewCount from all jobs)
    const jobs = await this.jobRepository.find({
      where: {
        companyId: In(companyIds),
      },
      select: ['viewCount'],
    });

    const totalViews = jobs.reduce((sum, job) => sum + (job.viewCount || 0), 0);

    // Get hired count (accepted applications)
    const hiredCount = await this.applicationRepository.count({
      where: {
        job: {
          companyId: In(companyIds),
        },
        status: ApplicationStatus.HIRED,
      },
    });

    // Calculate response rate (applications with status other than 'pending')
    const respondedApplications = await this.applicationRepository.count({
      where: {
        job: {
          companyId: In(companyIds),
        },
        status: Not(ApplicationStatus.PENDING),
      },
    });

    const responseRate =
      totalApplications > 0
        ? Math.round((respondedApplications / totalApplications) * 100)
        : 0;

    // Calculate average hiring time (mock data for now)
    const avgHiringTime = 14; // days

    // Calculate quality applicants percentage (mock data for now)
    const qualityApplicants = 75;

    return {
      activeJobs,
      totalApplications,
      totalViews,
      hiredCount,
      responseRate,
      avgHiringTime,
      qualityApplicants,
    };
  }

  async getActiveJobs(userId: string, limit: number = 10) {
    // Find companies owned by this user
    const companies = await this.companyRepository.find({
      where: { ownerId: userId },
      select: ['id'],
    });

    const companyIds = companies.map((company) => company.id);

    if (companyIds.length === 0) {
      return [];
    }

    const jobs = await this.jobRepository.find({
      where: {
        companyId: In(companyIds),
        status: JobStatus.PUBLISHED,
      },
      relations: ['company'],
      select: {
        id: true,
        title: true,
        createdAt: true,
        viewCount: true,
        status: true,
      },
      order: { createdAt: 'DESC' },
      take: limit,
    });

    // Get application counts and tags for each job
    const jobsWithApplications = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await this.applicationRepository.count({
          where: { jobId: job.id },
        });

        // Get tags separately since they're a many-to-many relation
        const jobWithTags = await this.jobRepository.findOne({
          where: { id: job.id },
          relations: ['tags'],
          select: ['id', 'tags'],
        });

        return {
          id: job.id,
          title: job.title,
          postedDate: job.createdAt.toLocaleDateString('vi-VN'),
          views: job.viewCount || 0,
          applications: applicationCount,
          status: job.status,
          tags: jobWithTags?.tags?.map((tag) => tag.name) || [],
        };
      }),
    );

    return jobsWithApplications;
  }

  async getRecentApplicants(userId: string, limit: number = 10) {
    // Find companies owned by this user
    const companies = await this.companyRepository.find({
      where: { ownerId: userId },
      select: ['id'],
    });

    const companyIds = companies.map((company) => company.id);

    if (companyIds.length === 0) {
      return [];
    }

    const applications = await this.applicationRepository.find({
      where: {
        job: {
          companyId: In(companyIds),
        },
      },
      relations: ['job', 'jobSeekerProfile', 'jobSeekerProfile.user'],
      select: {
        id: true,
        createdAt: true,
        job: {
          id: true,
          title: true,
        },
        jobSeekerProfile: {
          id: true,
          user: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return applications.map((app) => ({
      id: app.jobSeekerProfile.user.id,
      name: `${app.jobSeekerProfile.user.firstName} ${app.jobSeekerProfile.user.lastName}`,
      jobTitle: app.job.title,
      appliedDate: app.createdAt.toLocaleDateString('vi-VN'),
      avatar: app.jobSeekerProfile.user.avatar,
    }));
  }
}

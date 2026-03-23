import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not, Between, IsNull } from 'typeorm';
import { Job, JobStatus } from '../common/entities/job.entity';
import {
  Application,
  ApplicationStatus,
} from '../common/entities/application.entity';
import { User } from '../common/entities/user.entity';
import { Company } from '../common/entities/company.entity';
import { UserRole } from '../common/entities/user-role.entity';
import { RoleName } from '../common/entities/role.entity';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { ScheduleInterviewDto } from './dto/schedule-interview.dto';
import { SendMessageDto, MessageType } from './dto/send-message.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../common/entities/notification.entity';
import { MessagingService } from '../messaging/messaging.service';
import { HRCompanyRelationshipService } from '../hr-company-relationship/hr-company-relationship.service';

@Injectable()
export class HRService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly notificationsService: NotificationsService,
    private readonly messagingService: MessagingService,
    private readonly hrCompanyRelationshipService: HRCompanyRelationshipService,
  ) {}

  async getCompanies(userId: string) {
    return this.getUserCompanies(userId);
  }

  async getDashboardStats(userId: string) {
    // Find companies owned by this user or where user is HR
    const companies = await this.getUserCompanies(userId);
    const companyIds = companies.map((company) => company.id);

    if (companyIds.length === 0) {
      return {
        activeJobs: 0,
        totalApplications: 0,
        interviewsScheduled: 0,
        offersSent: 0,
        hiresThisMonth: 0,
        responseRate: 0,
        avgTimeToHire: 0,
        totalViews: 0,
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

    // Get interviews scheduled
    const interviewsScheduled = await this.applicationRepository.count({
      where: {
        job: {
          companyId: In(companyIds),
        },
        interviewScheduledAt: Not(IsNull()),
      },
    });

    // Get offers sent (accepted applications)
    const offersSent = await this.applicationRepository.count({
      where: {
        job: {
          companyId: In(companyIds),
        },
        status: ApplicationStatus.HIRED,
      },
    });

    // Get hires this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const hiresThisMonth = await this.applicationRepository.count({
      where: {
        job: {
          companyId: In(companyIds),
        },
        status: ApplicationStatus.HIRED,
        updatedAt: Between(startOfMonth, new Date()),
      },
    });

    // Calculate response rate
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

    // Get total views
    const jobs = await this.jobRepository.find({
      where: {
        companyId: In(companyIds),
      },
      select: ['viewCount'],
    });

    const totalViews = jobs.reduce((sum, job) => sum + (job.viewCount || 0), 0);

    // Mock average time to hire for now
    const avgTimeToHire = 14;

    return {
      activeJobs,
      totalApplications,
      interviewsScheduled,
      offersSent,
      hiresThisMonth,
      responseRate,
      avgTimeToHire,
      totalViews,
    };
  }

  async getJobs(userId: string, query: any = {}) {
    const companies = await this.getUserCompanies(userId);
    const companyIds = companies.map((company) => company.id);

    if (companyIds.length === 0) {
      return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }

    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      companyId: In(companyIds),
    };

    if (status) where.status = status;

    const [jobs, total] = await this.jobRepository.findAndCount({
      where,
      relations: ['company', 'tags'],
      skip,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: jobs,
      total,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getJob(id: string, userId: string) {
    const companies = await this.getUserCompanies(userId);
    const companyIds = companies.map((company) => company.id);

    const job = await this.jobRepository.findOne({
      where: { id, companyId: In(companyIds) },
      relations: ['company', 'tags'],
    });

    if (!job) {
      throw new NotFoundException('Job not found or access denied');
    }

    return job;
  }

  async updateJobStatus(id: string, status: string, userId: string) {
    const job = await this.getJob(id, userId);

    await this.jobRepository.update(id, { status: status as JobStatus });
    return this.getJob(id, userId);
  }

  async getApplications(userId: string, query: any = {}) {
    const companies = await this.getUserCompanies(userId);
    const companyIds = companies.map((company) => company.id);

    if (companyIds.length === 0) {
      return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }

    const { page = 1, limit = 10, status, jobId } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      job: {
        companyId: In(companyIds),
      },
    };

    if (status) where.status = status;
    if (jobId) where.jobId = jobId;

    const [applications, total] = await this.applicationRepository.findAndCount(
      {
        where,
        relations: [
          'job',
          'jobSeekerProfile',
          'jobSeekerProfile.user',
          'reviewedBy',
        ],
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      },
    );

    return {
      data: applications,
      total,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getApplication(id: string, userId: string) {
    const companies = await this.getUserCompanies(userId);
    const companyIds = companies.map((company) => company.id);

    const application = await this.applicationRepository.findOne({
      where: { id, job: { companyId: In(companyIds) } },
      relations: [
        'job',
        'jobSeekerProfile',
        'jobSeekerProfile.user',
        'reviewedBy',
      ],
    });

    if (!application) {
      throw new NotFoundException('Application not found or access denied');
    }

    return application;
  }

  async updateApplicationStatus(
    id: string,
    updateDto: UpdateApplicationStatusDto,
    userId: string,
  ) {
    const application = await this.getApplication(id, userId);

    // Validate status transitions
    if (
      updateDto.status === ApplicationStatus.HIRED &&
      application.status !== ApplicationStatus.REVIEWED
    ) {
      throw new ForbiddenException('Can only accept shortlisted applications');
    }

    const updateData: any = {
      status: updateDto.status,
      reviewedAt: new Date(),
      reviewedById: userId,
    };

    if (updateDto.notes) {
      updateData.notes = updateDto.notes;
    }

    await this.applicationRepository.update(id, updateData);

    // Send notification to applicant
    try {
      let notificationMessage = '';
      switch (updateDto.status) {
        case ApplicationStatus.REVIEWED:
          notificationMessage = `Đơn ứng tuyển của bạn cho vị trí ${application.job.title} đang được xem xét.`;
          break;
        case ApplicationStatus.INTERVIEW:
          notificationMessage = `Bạn đã được mời phỏng vấn cho vị trí ${application.job.title}.`;
          break;
        case ApplicationStatus.HIRED:
          notificationMessage = `Chúc mừng! Bạn đã được chấp nhận cho vị trí ${application.job.title}.`;
          break;
        case ApplicationStatus.REJECTED:
          notificationMessage = `Rất tiếc, đơn ứng tuyển của bạn cho vị trí ${application.job.title} không được chấp nhận.`;
          break;
      }

      if (notificationMessage) {
        await this.notificationsService.create(
          application.jobSeekerProfile.userId,
          NotificationType.APPLICATION_STATUS_CHANGED,
          'Cập nhật trạng thái ứng tuyển',
          notificationMessage,
          {
            relatedEntityId: application.id,
            relatedEntityType: 'application',
            priority: 2,
          },
        );
      }
    } catch (error) {
      console.error('Failed to send status update notification:', error);
    }

    return this.getApplication(id, userId);
  }

  async scheduleInterview(
    id: string,
    scheduleDto: ScheduleInterviewDto,
    userId: string,
  ) {
    const application = await this.getApplication(id, userId);

    // Check if application is in appropriate status
    if (application.status !== ApplicationStatus.REVIEWED) {
      throw new ForbiddenException(
        'Can only schedule interviews for reviewed applications',
      );
    }

    await this.applicationRepository.update(id, {
      status: ApplicationStatus.INTERVIEW,
      interviewScheduledAt: new Date(scheduleDto.interviewDate),
      interviewNotes: scheduleDto.notes,
      reviewedAt: new Date(),
      reviewedById: userId,
    });

    // Send notification to applicant
    try {
      await this.notificationsService.create(
        application.jobSeekerProfile.userId,
        NotificationType.SYSTEM_ANNOUNCEMENT,
        'Lịch phỏng vấn đã được sắp xếp',
        `Bạn có lịch phỏng vấn cho vị trí ${application.job.title} vào ${scheduleDto.interviewDate}`,
        {
          relatedEntityId: application.id,
          relatedEntityType: 'application',
          priority: 3,
        },
      );
    } catch (error) {
      console.error('Failed to send interview notification:', error);
    }

    return this.getApplication(id, userId);
  }

  async sendMessageToApplicant(
    id: string,
    messageDto: SendMessageDto,
    userId: string,
  ) {
    const application = await this.getApplication(id, userId);

    try {
      if (messageDto.type === MessageType.EMAIL) {
        // For now, just send in-app notification since sendEmail doesn't exist
        // TODO: Implement email functionality
        await this.notificationsService.create(
          application.jobSeekerProfile.userId,
          NotificationType.SYSTEM_ANNOUNCEMENT,
          messageDto.subject,
          messageDto.message,
          {
            relatedEntityId: application.id,
            relatedEntityType: 'application',
            priority: 2,
          },
        );
      } else if (messageDto.type === MessageType.IN_APP) {
        // Send in-app notification
        await this.notificationsService.create(
          application.jobSeekerProfile.userId,
          NotificationType.SYSTEM_ANNOUNCEMENT,
          messageDto.subject,
          messageDto.message,
          {
            relatedEntityId: application.id,
            relatedEntityType: 'application',
            priority: 2,
          },
        );
      }
    } catch (error) {
      console.error('Failed to send message to applicant:', error);
      throw error;
    }

    return { success: true, message: 'Message sent successfully' };
  }

  async getTeamMembers(userId: string) {
    const companies = await this.getUserCompanies(userId);
    const companyIds = companies.map((company) => company.id);

    if (companyIds.length === 0) {
      return [];
    }

    // Find all HR users who work for these companies
    const hrUserRoles = await this.userRoleRepository.find({
      where: {
        role: { name: RoleName.HR },
      },
      relations: ['user', 'role'],
    });

    // For now, return all HR users (since we don't have company-specific HR assignment)
    // TODO: Implement proper company-HR relationship
    const hrUsers = hrUserRoles.map((userRole) => ({
      id: userRole.user.id,
      name:
        userRole.user.fullName ||
        `${userRole.user.firstName} ${userRole.user.lastName}`,
      role: 'HR Specialist', // Could be enhanced with different HR roles
      email: userRole.user.email,
      avatar: userRole.user.avatarUrl || userRole.user.avatar,
    }));

    return hrUsers;
  }

  async getReportsOverview(userId: string, query: any = {}) {
    const companies = await this.getUserCompanies(userId);
    const companyIds = companies.map((company) => company.id);

    if (companyIds.length === 0) {
      return this.getEmptyReports();
    }

    const { period = 'month' } = query;

    // Calculate date range
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Get applications in period
    const applicationsInPeriod = await this.applicationRepository.find({
      where: {
        job: { companyId: In(companyIds) },
        createdAt: Between(startDate, now),
      },
    });

    // Calculate metrics
    const totalApplications = applicationsInPeriod.length;
    const hired = applicationsInPeriod.filter(
      (app) => app.status === ApplicationStatus.HIRED,
    ).length;
    const rejected = applicationsInPeriod.filter(
      (app) => app.status === ApplicationStatus.REJECTED,
    ).length;
    const inProgress = applicationsInPeriod.filter((app) =>
      [
        ApplicationStatus.REVIEWED,
        ApplicationStatus.INTERVIEW,
      ].includes(app.status),
    ).length;

    const conversionRate =
      totalApplications > 0 ? (hired / totalApplications) * 100 : 0;

    return {
      totalApplications,
      hired,
      rejected,
      inProgress,
      conversionRate: Math.round(conversionRate * 100) / 100,
      period,
    };
  }

  async getJobPerformanceReports(userId: string, query: any = {}) {
    const companies = await this.getUserCompanies(userId);
    const companyIds = companies.map((company) => company.id);

    if (companyIds.length === 0) {
      return [];
    }

    const jobs = await this.jobRepository.find({
      where: { companyId: In(companyIds) },
      relations: ['applications'],
    });

    const jobPerformance = await Promise.all(
      jobs.map(async (job) => {
        const applications = await this.applicationRepository.find({
          where: { jobId: job.id },
        });

        const hired = applications.filter(
          (app) => app.status === ApplicationStatus.HIRED,
        ).length;

        const conversionRate =
          applications.length > 0 ? (hired / applications.length) * 100 : 0;

        return {
          jobId: job.id,
          jobTitle: job.title,
          applications: applications.length,
          views: job.viewCount || 0,
          hired,
          conversionRate: Math.round(conversionRate * 100) / 100,
          status: job.status,
        };
      }),
    );

    return jobPerformance.sort((a, b) => b.applications - a.applications);
  }

  async getHiringFunnelReport(userId: string, query: any = {}) {
    const companies = await this.getUserCompanies(userId);
    const companyIds = companies.map((company) => company.id);

    if (companyIds.length === 0) {
      return this.getEmptyFunnel();
    }

    const applications = await this.applicationRepository.find({
      where: {
        job: { companyId: In(companyIds) },
      },
    });

    const funnel = {
      applied: applications.length,
      reviewing: applications.filter(
        (app) => app.status === ApplicationStatus.REVIEWED,
      ).length,
      shortlisted: applications.filter(
        (app) => app.status === ApplicationStatus.INTERVIEW,
      ).length,
      interviewed: applications.filter(
        (app) => app.status === ApplicationStatus.INTERVIEW,
      ).length,
      offered: applications.filter(
        (app) => app.status === ApplicationStatus.HIRED,
      ).length,
      hired: applications.filter(
        (app) => app.status === ApplicationStatus.HIRED,
      ).length, // Same as offered for now
    };

    return funnel;
  }

  async getUpcomingInterviews(userId: string) {
    const companies = await this.getUserCompanies(userId);
    const companyIds = companies.map((company) => company.id);

    if (companyIds.length === 0) {
      return [];
    }

    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + 30); // Next 30 days

    const interviews = await this.applicationRepository.find({
      where: {
        job: { companyId: In(companyIds) },
        interviewScheduledAt: Between(now, futureDate),
      },
      relations: ['job', 'jobSeekerProfile', 'jobSeekerProfile.user'],
      order: { interviewScheduledAt: 'ASC' },
    });

    return interviews.map((interview) => ({
      id: interview.id,
      candidateName: `${interview.jobSeekerProfile.user.firstName} ${interview.jobSeekerProfile.user.lastName}`,
      jobTitle: interview.job.title,
      interviewDate: interview.interviewScheduledAt?.toISOString(),
      interviewType: 'scheduled', // Could be enhanced
      interviewer: interview.reviewedBy?.fullName || 'HR Team',
      notes: interview.interviewNotes,
    }));
  }

  async getAllInterviews(userId: string, query: any = {}) {
    const companies = await this.getUserCompanies(userId);
    const companyIds = companies.map((company) => company.id);

    if (companyIds.length === 0) {
      return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }

    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [interviews, total] = await this.applicationRepository.findAndCount({
      where: {
        job: { companyId: In(companyIds) },
        interviewScheduledAt: Not(IsNull()),
      },
      relations: [
        'job',
        'jobSeekerProfile',
        'jobSeekerProfile.user',
        'reviewedBy',
      ],
      skip,
      take: limit,
      order: { interviewScheduledAt: 'DESC' },
    });

    return {
      data: interviews,
      total,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserCompanies(userId: string): Promise<Company[]> {
    // Find companies owned by this user
    const ownedCompanies = await this.companyRepository.find({
      where: { ownerId: userId },
      select: ['id', 'name'],
    });

    // Also find companies where user has HR role through HR-Company relationships
    let hrCompanies: Company[] = [];
    try {
      hrCompanies =
        await this.hrCompanyRelationshipService.getHRCompaniesForUser(userId);
    } catch (error) {
      // If HR relationship service fails (table doesn't exist), just return owned companies
      console.warn(
        'HR relationship service failed, returning only owned companies:',
        error.message,
      );
    }

    // Combine and deduplicate companies
    const allCompanies = [...ownedCompanies];
    hrCompanies.forEach((hrCompany) => {
      if (!allCompanies.some((company) => company.id === hrCompany.id)) {
        allCompanies.push(hrCompany);
      }
    });

    return allCompanies;
  }

  private getEmptyReports() {
    return {
      totalApplications: 0,
      hired: 0,
      rejected: 0,
      inProgress: 0,
      conversionRate: 0,
      period: 'month',
    };
  }

  private getEmptyFunnel() {
    return {
      applied: 0,
      reviewing: 0,
      shortlisted: 0,
      interviewed: 0,
      offered: 0,
      hired: 0,
    };
  }
}

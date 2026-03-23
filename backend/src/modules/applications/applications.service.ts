import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Application,
  ApplicationStatus,
} from '../common/entities/application.entity';
import { Job } from '../common/entities/job.entity';
import { User } from '../common/entities/user.entity';
import { JobSeekerProfile } from '../common/entities/job-seeker-profile.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../common/entities/notification.entity';
import { HRCompanyRelationshipService } from '../hr-company-relationship/hr-company-relationship.service';
import {
  ApplicationEvent,
  ApplicationEventType,
} from '../common/entities/application-event.entity';
import { CvService } from '../cv/cv.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(ApplicationEvent)
    private applicationEventRepository: Repository<ApplicationEvent>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(JobSeekerProfile)
    private jobSeekerProfileRepository: Repository<JobSeekerProfile>,
    private notificationsService: NotificationsService,
    private hrCompanyRelationshipService: HRCompanyRelationshipService,
    private cvService: CvService,
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto,
    userId: string,
  ): Promise<Application> {
    const { jobId, ...applicationData } = createApplicationDto;

    // Verify job exists and is published
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: ['company'],
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (!job.isActive) {
      throw new BadRequestException('Job is not available for applications');
    }

    // Get or create job seeker profile for the user
    let jobSeekerProfile = await this.userRepository
      .findOne({
        where: { id: userId },
        relations: ['jobSeekerProfiles'],
      })
      .then((user) => user?.jobSeekerProfiles?.[0]);

    // If no profile exists, create a basic one automatically
    if (!jobSeekerProfile) {
      console.log(
        'No job seeker profile found, creating a basic profile automatically...',
      );

      // Get user details
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Create a basic job seeker profile
      const newProfile = this.jobSeekerProfileRepository.create({
        userId: userId,
        fullName:
          `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
        email: user.email,
        phone: user.phone || '',
        profileCompletion: 20, // Basic completion percentage
        lastUpdatedAt: new Date(),
      });

      jobSeekerProfile = await this.jobSeekerProfileRepository.save(newProfile);
      console.log(
        '✅ Basic job seeker profile created automatically:',
        jobSeekerProfile.id,
      );
    }

    // Check if user already applied for this job
    const existingApplication = await this.applicationRepository.findOne({
      where: { jobId, jobSeekerProfileId: jobSeekerProfile.id },
    });

    if (existingApplication) {
      throw new ConflictException('You have already applied for this job');
    }

    // Get primary CV or first published CV for the application
    const primaryCv = await this.cvService.getPrimaryCvOrFirst(userId);
    let cvUrl: string | undefined;

    if (primaryCv) {
      cvUrl = primaryCv.pdfUrl || primaryCv.publicUrl;
      console.log('Using CV for application:', primaryCv.title, cvUrl);
    } else {
      console.log('No CV available for application - proceeding without CV');
    }

    // Create application
    const application = this.applicationRepository.create({
      ...applicationData,
      jobId,
      job,
      jobSeekerProfileId: jobSeekerProfile.id,
      jobSeekerProfile,
      resumeUrl: cvUrl, // Use primary CV URL
    });

    const savedApplication = await this.applicationRepository.save(application);

    // Create ApplicationEvent for new application
    const applicationEvent = this.applicationEventRepository.create({
      applicationId: savedApplication.id,
      application: savedApplication,
      eventType: ApplicationEventType.APPLIED,
      description: `Application submitted for ${job.title}`,
      isVisibleToJobSeeker: true,
      triggeredById: userId,
    });
    await this.applicationEventRepository.save(applicationEvent);

    // Increment application count for the job
    await this.jobRepository.increment({ id: jobId }, 'applicationCount', 1);

    // Send notification to all HR users and company owner about new application
    try {
      // Get all HR users associated with the company
      const hrRelationships =
        await this.hrCompanyRelationshipService.getHRForCompany(job.company.id);
      const hrUserIds = hrRelationships.map(
        (relationship) => relationship.hrUserId,
      );

      // Add company owner to the list if not already included
      if (!hrUserIds.includes(job.company.ownerId)) {
        hrUserIds.push(job.company.ownerId);
      }

      // Send notification to all HR users and company owner
      const notificationPromises = hrUserIds.map((hrUserId) =>
        this.notificationsService.createApplicationReceivedNotification(
          hrUserId,
          job.title,
          jobSeekerProfile.fullName || 'Ứng viên',
          savedApplication.id,
        ),
      );

      await Promise.all(notificationPromises);
    } catch (error) {
      console.error('Failed to send notification for new application:', error);
      // Don't fail the application creation if notification fails
    }

    return savedApplication;
  }

  async findAll(query: any): Promise<{
    data: Application[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      status,
      jobId,
      jobSeekerProfileId,
      reviewedById,
    } = query;

    const skip = (page - 1) * limit;
    const where: any = {};

    // Add filters
    if (status) where.status = status;
    if (jobId) where.jobId = jobId;
    if (jobSeekerProfileId) where.jobSeekerProfileId = jobSeekerProfileId;
    if (reviewedById) where.reviewedById = reviewedById;

    const [applications, total] = await this.applicationRepository.findAndCount(
      {
        where,
        relations: ['job', 'jobSeekerProfile', 'reviewedBy', 'job.company'],
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

  async findOne(id: string): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['job', 'jobSeekerProfile', 'reviewedBy', 'job.company'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async update(
    id: string,
    updateApplicationDto: UpdateApplicationDto,
    userId: string,
  ): Promise<Application> {
    const application = await this.findOne(id);

    // Check if user owns this application or is an employer for the job
    if (
      application.jobSeekerProfile.userId !== userId &&
      application.job.company.ownerId !== userId
    ) {
      throw new ForbiddenException('You can only update your own applications');
    }

    await this.applicationRepository.update(id, updateApplicationDto);
    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    const application = await this.findOne(id);

    // Check if user owns this application
    if (application.jobSeekerProfile.userId !== userId) {
      throw new ForbiddenException('You can only delete your own applications');
    }

    // Check if application can be withdrawn (not hired/rejected)
    if (
      application.status === ApplicationStatus.HIRED ||
      application.status === ApplicationStatus.REJECTED
    ) {
      throw new BadRequestException(
        'Cannot withdraw hired or rejected applications',
      );
    }

    await this.applicationRepository.remove(application);

    // Decrement application count for the job
    await this.jobRepository.decrement(
      { id: application.jobId },
      'applicationCount',
      1,
    );
  }

  async updateStatus(
    id: string,
    status: ApplicationStatus,
    userId: string,
    notes?: string,
  ): Promise<Application> {
    const application = await this.findOne(id);

    // Check if user is the employer for this job
    if (application.job.company.ownerId !== userId) {
      throw new ForbiddenException(
        'Only the job employer can update application status',
      );
    }

    // Validate status transitions
    if (
      status === ApplicationStatus.HIRED &&
      application.status !== ApplicationStatus.INTERVIEW
    ) {
      throw new BadRequestException(
        'Can only hire applications that have been interviewed',
      );
    }

    const updateData: any = {
      status,
      reviewedAt: new Date(),
      reviewedById: userId,
    };

    if (notes) {
      updateData.notes = notes;
    }

    // Store old status for event logging
    const oldStatus = application.status;

    await this.applicationRepository.update(id, updateData);
    const updatedApplication = await this.findOne(id);

    // Create ApplicationEvent for status change
    const statusChangeEvent = this.applicationEventRepository.create({
      applicationId: application.id,
      application: application,
      eventType: ApplicationEventType.STATUS_CHANGED,
      oldStatus: oldStatus,
      newStatus: status,
      description: `Application status changed from ${oldStatus} to ${status}`,
      isVisibleToJobSeeker: true,
      triggeredById: userId,
    });
    await this.applicationEventRepository.save(statusChangeEvent);

    // Send appropriate notification based on status change
    try {
      if (status === ApplicationStatus.REVIEWED) {
        await this.notificationsService.createApplicationStatusChangedNotification(
          application.jobSeekerProfile.userId,
          application.job.title,
          'reviewed',
          application.id,
        );
      } else if (status === ApplicationStatus.REJECTED) {
        await this.notificationsService.createApplicationRejectedNotification(
          application.jobSeekerProfile.userId,
          application.job.title,
          application.job.company.name,
          application.id,
        );
      } else if (status === ApplicationStatus.HIRED) {
        await this.notificationsService.createApplicationApprovedNotification(
          application.jobSeekerProfile.userId,
          application.job.title,
          application.job.company.name,
          application.id,
        );
      }
    } catch (error) {
      console.error('Failed to send status change notification:', error);
      // Don't fail the status update if notification fails
    }

    return updatedApplication;
  }

  async scheduleInterview(
    id: string,
    interviewDate: Date,
    notes: string,
    userId: string,
  ): Promise<Application> {
    const application = await this.findOne(id);

    // Check if user is the employer for this job
    if (application.job.company.ownerId !== userId) {
      throw new ForbiddenException(
        'Only the job employer can schedule interviews',
      );
    }

    // Check if application is in appropriate status
    if (application.status !== ApplicationStatus.REVIEWED) {
      throw new BadRequestException(
        'Can only schedule interviews for reviewed applications',
      );
    }

    await this.applicationRepository.update(id, {
      status: ApplicationStatus.INTERVIEW,
      interviewScheduledAt: interviewDate,
      interviewNotes: notes,
      reviewedAt: new Date(),
      reviewedById: userId,
    });

    const updatedApplication = await this.findOne(id);

    // Create ApplicationEvent for interview scheduling
    const interviewEvent = this.applicationEventRepository.create({
      applicationId: application.id,
      application: application,
      eventType: ApplicationEventType.INTERVIEW_SCHEDULED,
      description: `Interview scheduled for ${interviewDate.toLocaleDateString()}`,
      isVisibleToJobSeeker: true,
      triggeredById: userId,
    });
    interviewEvent.setEventData({ interviewDate: interviewDate.toISOString() });
    await this.applicationEventRepository.save(interviewEvent);

    // Send interview scheduled notification
    try {
      await this.notificationsService.createApplicationInterviewScheduledNotification(
        application.jobSeekerProfile.userId,
        application.job.title,
        application.job.company.name,
        interviewDate,
        application.id,
      );
    } catch (error) {
      console.error('Failed to send interview scheduled notification:', error);
      // Don't fail the interview scheduling if notification fails
    }

    return updatedApplication;
  }

  async findByJob(jobId: string, userId?: string): Promise<Application[]> {
    const where: any = { jobId };

    // If userId provided, check if user is the employer
    if (userId) {
      const job = await this.jobRepository.findOne({ where: { id: jobId } });
      if (job?.company.ownerId === userId) {
        // Employer can see all applications
      } else {
        // Regular users can only see their own applications - need to find jobSeekerProfile for userId
        const jobSeekerProfile = await this.userRepository
          .findOne({
            where: { id: userId },
            relations: ['jobSeekerProfiles'],
          })
          .then((user) => user?.jobSeekerProfiles?.[0]);

        if (jobSeekerProfile) {
          where.jobSeekerProfileId = jobSeekerProfile.id;
        }
      }
    }

    return this.applicationRepository.find({
      where,
      relations: ['jobSeekerProfile', 'reviewedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByApplicant(userId: string): Promise<Application[]> {
    // Find job seeker profile for the user
    const jobSeekerProfile = await this.userRepository
      .findOne({
        where: { id: userId },
        relations: ['jobSeekerProfiles'],
      })
      .then((user) => user?.jobSeekerProfiles?.[0]);

    if (!jobSeekerProfile) {
      return [];
    }

    return this.applicationRepository.find({
      where: { jobSeekerProfileId: jobSeekerProfile.id },
      relations: ['job', 'job.company', 'reviewedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async getApplicationStats(userId: string): Promise<{
    totalApplications: number;
    pendingApplications: number;
    reviewedApplications: number;
    acceptedApplications: number;
    rejectedApplications: number;
  }> {
    // Find job seeker profile for the user
    const jobSeekerProfile = await this.userRepository
      .findOne({
        where: { id: userId },
        relations: ['jobSeekerProfiles'],
      })
      .then((user) => user?.jobSeekerProfiles?.[0]);

    if (!jobSeekerProfile) {
      return {
        totalApplications: 0,
        pendingApplications: 0,
        reviewedApplications: 0,
        acceptedApplications: 0,
        rejectedApplications: 0,
      };
    }

    const applications = await this.applicationRepository.find({
      where: { jobSeekerProfileId: jobSeekerProfile.id },
    });

    return {
      totalApplications: applications.length,
      pendingApplications: applications.filter(
        (app) => app.status === ApplicationStatus.PENDING,
      ).length,
      reviewedApplications: applications.filter((app) =>
        [ApplicationStatus.REVIEWED, ApplicationStatus.INTERVIEW].includes(
          app.status,
        ),
      ).length,
      acceptedApplications: applications.filter(
        (app) => app.status === ApplicationStatus.HIRED,
      ).length,
      rejectedApplications: applications.filter(
        (app) => app.status === ApplicationStatus.REJECTED,
      ).length,
    };
  }

  async incrementViewCount(id: string, userId: string): Promise<void> {
    const application = await this.findOne(id);

    // Only employer can increment view count
    if (application.job.company.ownerId !== userId) {
      return;
    }

    await this.applicationRepository.increment({ id }, 'viewCount', 1);

    // Create ApplicationEvent for CV view
    const viewEvent = this.applicationEventRepository.create({
      applicationId: application.id,
      application: application,
      eventType: ApplicationEventType.CV_DOWNLOADED,
      description: 'CV was viewed by employer',
      isVisibleToJobSeeker: true,
      triggeredById: userId,
    });
    await this.applicationEventRepository.save(viewEvent);
  }
}

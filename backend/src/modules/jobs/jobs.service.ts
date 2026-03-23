import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Repository, ILike, In, Brackets } from 'typeorm';
import { Job, JobStatus } from '../common/entities/job.entity';
import { Company } from '../common/entities/company.entity';
import { User } from '../common/entities/user.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Skill } from '../common/entities/skill.entity';
import { JobTag } from '../common/entities/job-tag.entity';
import { JobCategory } from '../common/entities/job-category.entity';
import { HRService } from '../hr/hr.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JobView } from '../common/entities/job-view.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
    @InjectRepository(JobTag)
    private jobTagRepository: Repository<JobTag>,
    @InjectRepository(JobCategory)
    private jobCategoryRepository: Repository<JobCategory>,
    @InjectRepository(JobView)
    private jobViewRepository: Repository<JobView>,
    private hrService: HRService,
    private subscriptionsService: SubscriptionsService,
  ) {}

  async create(createJobDto: CreateJobDto, userId: string): Promise<Job> {
    console.log('🔄 Creating job with data:', {
      userId,
      createJobDto: { ...createJobDto, description: createJobDto.description?.substring(0, 50) + '...' }
    });

    const { companyId, skillIds, tagIds, expiresAt, categoryId, ...jobData } =
      createJobDto;

    // Verify company exists and user has access
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      console.error('❌ Company not found:', companyId);
      throw new NotFoundException('Company not found');
    }

    console.log('✅ Company found:', company.name);

    // Check if user owns the company OR has HR access to the company
    const userCompanies = await this.hrService.getUserCompanies(userId);
    console.log('📋 User companies:', userCompanies.map(c => ({ id: c.id, name: c.name })));

    const hasAccess = userCompanies.some((c) => c.id === companyId);

    if (!hasAccess) {
      console.error('❌ User does not have access to company:', companyId);
      throw new ForbiddenException(
        'You can only create jobs for companies you have access to',
      );
    }

    console.log('✅ User has access to company');

    // Verify category exists if provided
    let category: JobCategory | undefined = undefined;
    if (categoryId) {
      const foundCategory = await this.jobCategoryRepository.findOne({
        where: { id: categoryId },
      });
      if (!foundCategory) {
        throw new NotFoundException('Job category not found');
      }
      category = foundCategory;
    }

    // Create job
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const job = this.jobRepository.create({
      ...jobData,
      company,
      postedBy: user,
      category,
      status: JobStatus.PUBLISHED, // Auto-publish for immediate visibility
      publishedAt: new Date(),
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });

    // Check subscription limits before creating job
    const subscriptionCheck = await this.subscriptionsService.canPostJob(companyId);

    if (!subscriptionCheck.canPost) {
      console.error('❌ Subscription limit reached:', subscriptionCheck.reason);
      throw new BadRequestException(
        subscriptionCheck.reason || 'Subscription limit reached. Cannot create job.',
      );
    }

    // Save job first to get the ID
    console.log('💾 Saving job to database...');
    const savedJob = await this.jobRepository.save(job);
    console.log('✅ Job saved with ID:', savedJob.id);

    // Increment jobs posted count in subscription
    await this.subscriptionsService.incrementJobsPosted(companyId);
    console.log('✅ Subscription job count incremented');

    // Handle skills relationships
    if (skillIds && skillIds.length > 0) {
      console.log('🔗 Processing skills:', skillIds.length, 'skills');
      const skills = await this.skillRepository.find({
        where: { id: In(skillIds) },
      });
      savedJob.skills = skills;
      await this.jobRepository.save(savedJob);
      console.log('✅ Skills attached:', skills.length);
    }

    // Handle tags relationships
    if (tagIds && tagIds.length > 0) {
      console.log('🏷️ Processing tags:', tagIds.length, 'tags');
      const tags = await this.jobTagRepository.find({
        where: { id: In(tagIds) },
      });
      savedJob.tags = tags;
      await this.jobRepository.save(savedJob);
      console.log('✅ Tags attached:', tags.length);
    }

    // Return the job without incrementing view count for newly created jobs
    console.log('📤 Fetching final job data...');
    const createdJob = await this.jobRepository.findOne({
      where: { id: savedJob.id },
      relations: ['company', 'postedBy', 'category', 'skills', 'tags'],
    });

    if (!createdJob) {
      console.error('❌ Job not found after creation');
      throw new NotFoundException('Job not found after creation');
    }

    console.log('🎉 Job creation completed successfully:', {
      id: createdJob.id,
      title: createdJob.title,
      company: createdJob.company.name,
      status: createdJob.status,
      skills: createdJob.skills?.length || 0,
      tags: createdJob.tags?.length || 0,
    });

    return createdJob;
  }

  async findAll(
    query: Record<string, any>,
    userId?: string,
  ): Promise<{
    data: Job[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      jobType,
      experienceLevel,
      city,
      country,
      remoteWork,
      skills,
      tags,
      minSalary,
      maxSalary,
      companyId,
      status = JobStatus.PUBLISHED,
    } = query;

    const skip = (page - 1) * limit;

    // Create query builder first
    const queryBuilder = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.postedBy', 'postedBy')
      .leftJoinAndSelect('job.category', 'category')
      .leftJoinAndSelect('job.skills', 'skill')
      .leftJoinAndSelect('job.tags', 'tag');

    // Apply where conditions based on authentication status
    if (userId) {
      // Get user's companies
      const userCompanies = await this.companyRepository.find({
        where: { ownerId: userId },
      });
      const companyIds = userCompanies.map((company) => company.id);

      if (companyIds.length > 0) {
        // For authenticated users, show published jobs OR draft jobs from their companies
        queryBuilder.where(
          new Brackets((qb) => {
            qb.where('job.status = :publishedStatus', {
              publishedStatus: JobStatus.PUBLISHED,
            }).orWhere(
              'job.status = :draftStatus AND job.company_id IN (:...companyIds)',
              {
                draftStatus: JobStatus.DRAFT,
                companyIds: companyIds,
              },
            );
          }),
        );
      } else {
        // No companies, show only published jobs
        queryBuilder.where('job.status = :publishedStatus', {
          publishedStatus: JobStatus.PUBLISHED,
        });
      }
    } else {
      // Anonymous user, show only published jobs
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      queryBuilder.where('job.status = :status', { status });
    }

    // Add search filter
    if (search) {
      queryBuilder.andWhere('job.title ILIKE :search', {
        search: `%${search}%`,
      });
    }

    // Add filters
    if (jobType) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      queryBuilder.andWhere('job.jobType = :jobType', { jobType });
    }
    if (experienceLevel) {
      queryBuilder.andWhere('job.experienceLevel = :experienceLevel', {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        experienceLevel,
      });
    }
    if (city) {
      queryBuilder.andWhere('job.city ILIKE :city', { city: `%${city}%` });
    }
    if (country) {
      queryBuilder.andWhere('job.country ILIKE :country', {
        country: `%${country}%`,
      });
    }
    if (remoteWork !== undefined) {
      queryBuilder.andWhere('job.remoteWork = :remoteWork', {
        remoteWork: remoteWork === 'true',
      });
    }
    if (companyId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      queryBuilder.andWhere('job.companyId = :companyId', { companyId });
    }

    // Salary filters
    if (minSalary) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      queryBuilder.andWhere('job.minSalary >= :minSalary', { minSalary });
    }
    if (maxSalary) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      queryBuilder.andWhere('job.maxSalary <= :maxSalary', { maxSalary });
    }

    // Skills filter
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      queryBuilder.andWhere('skill.name IN (:...skillNames)', {
        skillNames: skillsArray,
      });
    }

    // Tags filter
    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      queryBuilder.andWhere('tag.name IN (:...tagNames)', {
        tagNames: tagsArray,
      });
    }

    const [jobs, total] = await queryBuilder
      .skip(skip)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .take(limit)
      .orderBy('job.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data: jobs,
      total,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId?: string): Promise<Job> {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['company', 'postedBy', 'category', 'skills', 'tags'],
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Only increment view count for anonymous users or when not viewing own job
    if (!userId || job.company.ownerId !== userId) {
      await this.incrementViewCount(id, userId);
    }

    return job;
  }

  async update(
    id: string,
    updateJobDto: UpdateJobDto,
    userId: string,
  ): Promise<Job> {
    const job = await this.findOne(id);

    // Check if user owns the company that posted this job
    if (job.company.ownerId !== userId) {
      throw new ForbiddenException(
        'You can only update jobs from your own companies',
      );
    }

    const { expiresAt, ...updateData } = updateJobDto;

    // Update job
    await this.jobRepository.update(id, {
      ...updateData,
      expiresAt: expiresAt ? new Date(expiresAt) : job.expiresAt,
    });

    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    const job = await this.findOne(id);

    // Check if user owns the company that posted this job
    if (job.company.ownerId !== userId) {
      throw new ForbiddenException(
        'You can only delete jobs from your own companies',
      );
    }

    await this.jobRepository.remove(job);
  }

  async publishJob(id: string, userId: string): Promise<Job> {
    const job = await this.findOne(id);

    if (job.company.ownerId !== userId) {
      throw new ForbiddenException(
        'You can only publish jobs from your own companies',
      );
    }

    if (job.status !== JobStatus.DRAFT) {
      throw new BadRequestException('Only draft jobs can be published');
    }

    // Check subscription limits before publishing
    const subscriptionCheck = await this.subscriptionsService.canPostJob(job.companyId);

    if (!subscriptionCheck.canPost) {
      throw new BadRequestException(
        subscriptionCheck.reason || 'Subscription limit reached. Cannot publish job.',
      );
    }

    // Publish the job
    await this.jobRepository.update(id, {
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
    });

    // Increment jobs posted count in subscription (only for manual publishing)
    await this.subscriptionsService.incrementJobsPosted(job.companyId);

    return this.findOne(id);
  }

  async closeJob(id: string, userId: string): Promise<Job> {
    const job = await this.findOne(id);

    if (job.company.ownerId !== userId) {
      throw new ForbiddenException(
        'You can only close jobs from your own companies',
      );
    }

    await this.jobRepository.update(id, {
      status: JobStatus.CLOSED,
    });

    return this.findOne(id);
  }

  async findByCompany(companyId: string): Promise<Job[]> {
    return this.jobRepository.find({
      where: { companyId },
      relations: ['company', 'postedBy', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  async incrementViewCount(id: string, userId?: string): Promise<void> {
    // Increment view count in job table
    await this.jobRepository.increment({ id }, 'viewCount', 1);

    // Log the view in job_views table
    const jobView = this.jobViewRepository.create({
      jobId: id,
      userId: userId || undefined,
      viewedAt: new Date(),
    });
    await this.jobViewRepository.save(jobView);
  }

  async getJobStats(userId: string): Promise<{
    totalJobs: number;
    publishedJobs: number;
    draftJobs: number;
    totalViews: number;
    totalApplications: number;
  }> {
    const userCompanies = await this.companyRepository.find({
      where: { ownerId: userId },
    });

    const companyIds = userCompanies.map((company) => company.id);

    if (companyIds.length === 0) {
      return {
        totalJobs: 0,
        publishedJobs: 0,
        draftJobs: 0,
        totalViews: 0,
        totalApplications: 0,
      };
    }

    const jobs = await this.jobRepository.find({
      where: { companyId: In(companyIds) },
    });

    const totalJobs = jobs.length;
    const publishedJobs = jobs.filter(
      (job) => job.status === JobStatus.PUBLISHED,
    ).length;
    const draftJobs = jobs.filter(
      (job) => job.status === JobStatus.DRAFT,
    ).length;
    const totalViews = jobs.reduce((sum, job) => sum + job.viewCount, 0);
    const totalApplications = jobs.reduce(
      (sum, job) => sum + job.applicationCount,
      0,
    );

    return {
      totalJobs,
      publishedJobs,
      draftJobs,
      totalViews,
      totalApplications,
    };
  }

  // Cron job to automatically expire jobs
  @Cron(CronExpression.EVERY_HOUR)
  async expireJobs(): Promise<void> {
    const expiredJobs = await this.jobRepository
      .createQueryBuilder('job')
      .where('job.status = :status', { status: JobStatus.PUBLISHED })
      .andWhere('job.expiresAt IS NOT NULL')
      .andWhere('job.expiresAt < :now', { now: new Date() })
      .getMany();

    if (expiredJobs.length > 0) {
      await this.jobRepository.update(
        { id: In(expiredJobs.map((job) => job.id)) },
        { status: JobStatus.EXPIRED },
      );

      console.log(`✅ Expired ${expiredJobs.length} jobs`);
    }
  }
}

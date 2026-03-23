import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { User, UserStatus } from '../common/entities/user.entity';
import { Role, RoleName } from '../common/entities/role.entity';
import { UserRole } from '../common/entities/user-role.entity';
import { Job, JobStatus } from '../common/entities/job.entity';
import { Company } from '../common/entities/company.entity';
import {
  Application,
  ApplicationStatus,
} from '../common/entities/application.entity';
import { Skill } from '../common/entities/skill.entity';
import { JobCategory } from '../common/entities/job-category.entity';
import { Payment } from '../common/entities/payment.entity';
import { Notification } from '../common/entities/notification.entity';
import { BlogComment } from '../common/entities/blog-comment.entity';

// Interfaces for query parameters
interface PaginationQuery {
  page?: number;
  limit?: number;
}

interface UserQuery extends PaginationQuery {
  role?: string;
  status?: string;
  search?: string;
}

interface JobQuery extends PaginationQuery {
  status?: string;
  company?: string;
  search?: string;
}

interface CompanyQuery extends PaginationQuery {
  status?: string;
  search?: string;
}

interface ApplicationQuery extends PaginationQuery {
  status?: string;
  jobId?: string;
  userId?: string;
}

interface SkillQuery extends PaginationQuery {
  search?: string;
}

interface JobCategoryQuery extends PaginationQuery {
  search?: string;
}

interface SystemLogsQuery {
  level?: string;
  limit?: number;
}

interface AnalyticsQuery {
  startDate?: string;
  endDate?: string;
}

interface RevenueQuery extends AnalyticsQuery {
  groupBy?: string;
}

interface PackageJson {
  version: string;
  name: string;
  // Add other fields as needed
}

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @InjectRepository(JobCategory)
    private readonly jobCategoryRepository: Repository<JobCategory>,
  @InjectRepository(Payment)
  private readonly paymentRepository: Repository<Payment>,
  @InjectRepository(Notification)
  private readonly notificationRepository: Repository<Notification>,
  @InjectRepository(BlogComment)
  private readonly blogCommentRepository: Repository<BlogComment>,
  ) {}

  // ===== DASHBOARD OVERVIEW =====
  async getDashboardOverview() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Users statistics
      const totalUsers = await this.userRepository.count();
      const activeUsers = await this.userRepository.count({
        where: { isActive: true },
      });
      const newUsersToday = await this.userRepository
        .createQueryBuilder('user')
        .where('user.createdAt BETWEEN :start AND :end', {
          start: today,
          end: tomorrow,
        })
        .getCount();

      // Jobs statistics
      const totalJobs = await this.jobRepository.count();
      const activeJobs = await this.jobRepository.count({
        where: { status: JobStatus.PUBLISHED },
      });
      const newJobsToday = await this.jobRepository
        .createQueryBuilder('job')
        .where('job.createdAt BETWEEN :start AND :end', {
          start: today,
          end: tomorrow,
        })
        .getCount();

      // Companies statistics
      const totalCompanies = await this.companyRepository.count();
      const activeCompanies = await this.companyRepository.count({
        where: { status: 'active' },
      });
      const newCompaniesToday = await this.companyRepository
        .createQueryBuilder('company')
        .where('company.createdAt BETWEEN :start AND :end', {
          start: today,
          end: tomorrow,
        })
        .getCount();

      // Applications statistics
      const totalApplications = await this.applicationRepository.count();
      const pendingApplications = await this.applicationRepository.count({
        where: { status: ApplicationStatus.PENDING },
      });
      const newApplicationsToday = await this.applicationRepository
        .createQueryBuilder('application')
        .where('application.createdAt BETWEEN :start AND :end', {
          start: today,
          end: tomorrow,
        })
        .getCount();

      // Revenue statistics (simplified)
      const totalRevenue = 0; // Placeholder
      const thisMonthRevenue = 0; // Placeholder

      // System info
      const uptime = process.uptime();
      const memUsage = process.memoryUsage();

      return {
        users: {
          total: totalUsers,
          active: activeUsers,
          newToday: newUsersToday,
        },
        jobs: {
          total: totalJobs,
          active: activeJobs,
          newToday: newJobsToday,
        },
        companies: {
          total: totalCompanies,
          active: activeCompanies,
          newToday: newCompaniesToday,
        },
        applications: {
          total: totalApplications,
          pending: pendingApplications,
          newToday: newApplicationsToday,
        },
        revenue: {
          total: totalRevenue,
          thisMonth: thisMonthRevenue,
          growth: 0,
        },
        system: {
          uptime: Math.floor(uptime),
          memoryUsage: Math.round(memUsage.heapUsed / 1024 / 1024),
          diskUsage: 0,
        },
      };
    } catch (error) {
      this.logger.error('Error getting dashboard overview', error);
      throw error;
    }
  }

  async getDashboardCharts(period: string = '30d') {
    try {
      const days =
        period === '7d'
          ? 7
          : period === '30d'
            ? 30
            : period === '90d'
              ? 90
              : 365;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // User registrations over time
      const userRegistrations: any[] = await this.userRepository
        .createQueryBuilder('user')
        .select('DATE(user.createdAt)', 'date')
        .addSelect('COUNT(*)', 'count')
        .where('user.createdAt >= :startDate', { startDate })
        .groupBy('DATE(user.createdAt)')
        .orderBy('DATE(user.createdAt)', 'ASC')
        .getRawMany();

      // Job postings over time
      const jobPostings: any[] = await this.jobRepository
        .createQueryBuilder('job')
        .select('DATE(job.createdAt)', 'date')
        .addSelect('COUNT(*)', 'count')
        .where('job.createdAt >= :startDate', { startDate })
        .groupBy('DATE(job.createdAt)')
        .orderBy('DATE(job.createdAt)', 'ASC')
        .getRawMany();

      // Applications over time
      const applications: any[] = await this.applicationRepository
        .createQueryBuilder('application')
        .select('DATE(application.createdAt)', 'date')
        .addSelect('COUNT(*)', 'count')
        .where('application.createdAt >= :startDate', { startDate })
        .groupBy('DATE(application.createdAt)')
        .orderBy('DATE(application.createdAt)', 'ASC')
        .getRawMany();

      return {
        userRegistrations,
        jobPostings,
        applications,
        period,
      };
    } catch (error) {
      this.logger.error('Error getting dashboard charts', error);
      throw error;
    }
  }

  // ===== USER MANAGEMENT =====
  async createUser(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role: RoleName;
  }) {
    try {
      const { email, password, firstName, lastName, role } = userData;

      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Create user
      const user = this.userRepository.create({
        email,
        password, // Will be hashed by BeforeInsert hook
        firstName,
        lastName,
        status: UserStatus.ACTIVE,
      });

      const savedUser = await this.userRepository.save(user);

      // Assign role
      const roleEntity = await this.roleRepository.findOne({
        where: { name: role },
      });
      if (!roleEntity) {
        throw new BadRequestException(`Role ${role} not found`);
      }

      const userRole = this.userRoleRepository.create({
        user: savedUser,
        role: roleEntity,
      });
      await this.userRoleRepository.save(userRole);

      // Create company for employer role
      if (role === RoleName.EMPLOYER) {
        try {
          // Professional company names for demo purposes
          const companyNames = [
            'Tech Solutions Việt Nam',
            'Innovative Software Co.',
            'Digital Marketing Agency',
            'E-commerce Solutions',
            'Cloud Computing Services',
            'Mobile App Development',
            'Data Analytics Corp',
            'AI & Machine Learning Ltd',
            'Cybersecurity Experts',
            'Web Development Studio',
            'Software Consulting Group',
            'IT Infrastructure Services',
            'Digital Transformation Co.',
            'Startup Accelerator Hub',
            'Tech Startup Inc.',
            'Innovation Labs',
            'Future Tech Solutions',
            'Smart Systems Co.',
            'NextGen Technologies',
            'Modern Software House',
          ];

          const randomCompanyName =
            companyNames[Math.floor(Math.random() * companyNames.length)];

          const company = this.companyRepository.create({
            name: randomCompanyName,
            email: email, // Use registration email as company email
            ownerId: savedUser.id,
            owner: savedUser,
          });
          await this.companyRepository.save(company);
          console.log(`Company created for employer: ${company.name}`);
        } catch (companyError) {
          console.error('Failed to create company for employer:', companyError);
          // Don't fail user creation if company creation fails
        }
      }

      // Reload user with relations
      const userWithRoles = await this.userRepository.findOne({
        where: { id: savedUser.id },
        relations: ['userRoles', 'userRoles.role'],
      });

      this.logger.log(`User ${email} created by admin with role ${role}`);
      return userWithRoles;
    } catch (error) {
      this.logger.error('Error creating user', error);
      throw error;
    }
  }

  async getAllUsers(query: UserQuery) {
    try {
      const { page = 1, limit = 10, role, status, search } = query;
      const skip = (page - 1) * limit;

      // Map frontend role values to backend enum values
      const roleMapping: { [key: string]: string } = {
        'job-seeker': 'job_seeker',
        employer: 'employer',
        admin: 'admin',
        hr: 'hr',
      };

      // Use query builder for all cases to properly combine filters
      let qb = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.userRoles', 'userRole')
        .leftJoinAndSelect('userRole.role', 'roleEntity');

      // Apply role filter with mapping
      if (role) {
        const backendRole = roleMapping[role] || role;
        qb = qb.andWhere('roleEntity.name = :role', { role: backendRole });
      }

      // Apply status filter
      if (status) {
        qb = qb.andWhere('user.isActive = :isActive', {
          isActive: status === 'active',
        });
      }

      // Apply search filter
      if (search) {
        qb = qb.andWhere(
          '(user.email LIKE :search OR user.firstName LIKE :search OR user.lastName LIKE :search)',
          { search: `%${search}%` },
        );
      }

      // Execute query with pagination
      const [users, total] = await qb
        .orderBy('user.createdAt', 'DESC')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return {
        data: users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error('Error getting all users', error);
      throw error;
    }
  }

  async getUserDetails(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: [
          'userRoles',
          'userRoles.role',
          'jobSeekerProfiles',
          'jobSeekerProfiles.applications',
        ],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Get additional statistics
      const userStats = await this.getUserStatistics(id);

      return {
        ...user,
        statistics: userStats,
      };
    } catch (error) {
      this.logger.error(`Error getting user details for ${id}`, error);
      throw error;
    }
  }

  async updateUserStatus(id: string, status: string, reason?: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.isActive = status === 'active';
      if (reason) {
        user.statusReason = reason;
      }

      await this.userRepository.save(user);

      this.logger.log(`User ${id} status updated to ${status}`);
      return { message: 'User status updated successfully' };
    } catch (error) {
      this.logger.error(`Error updating user status for ${id}`, error);
      throw error;
    }
  }

  async updateUserRole(id: string, roleName: RoleName) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['userRoles'],
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const role = await this.roleRepository.findOne({
        where: { name: roleName },
      });
      if (!role) {
        throw new NotFoundException('Role not found');
      }

      // Remove existing roles
      await this.userRoleRepository.delete({ user: { id } });

      // Add new role
      const userRole = this.userRoleRepository.create({
        user,
        role,
      });
      await this.userRoleRepository.save(userRole);

      this.logger.log(`User ${id} role updated to ${roleName}`);
      return { message: 'User role updated successfully' };
    } catch (error) {
      this.logger.error(`Error updating user role for ${id}`, error);
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }

      this.logger.log(`User ${id} deleted`);
    } catch (error) {
      this.logger.error(`Error deleting user ${id}`, error);
      throw error;
    }
  }

  // ===== JOB MANAGEMENT =====
  async getAllJobs(query: JobQuery) {
    try {
      const { page = 1, limit = 10, status, company, search } = query;
      const skip = (page - 1) * limit;

      let qb = this.jobRepository
        .createQueryBuilder('job')
        .leftJoinAndSelect('job.company', 'company');

      if (status) {
        qb = qb.andWhere('job.status = :status', { status });
      }

      if (company) {
        qb = qb.andWhere('company.name LIKE :company', {
          company: `%${company}%`,
        });
      }

      if (search) {
        qb = qb.andWhere(
          '(job.title LIKE :search OR job.description LIKE :search OR company.name LIKE :search)',
          { search: `%${search}%` },
        );
      }

      const [jobs, total] = await qb
        .orderBy('job.createdAt', 'DESC')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return {
        data: jobs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error('Error getting all jobs', error);
      throw error;
    }
  }

  async updateJobStatus(id: string, status: string, reason?: string) {
    try {
      const job = await this.jobRepository.findOne({ where: { id } });
      if (!job) {
        throw new NotFoundException('Job not found');
      }

      // Validate status is a valid JobStatus enum value
      if (!Object.values(JobStatus).includes(status as JobStatus)) {
        throw new BadRequestException(`Invalid job status: ${status}`);
      }

      job.status = status as JobStatus;
      if (reason) {
        // Could add a reason field to Job entity
      }

      await this.jobRepository.save(job);

      this.logger.log(`Job ${id} status updated to ${status}`);
      return { message: 'Job status updated successfully' };
    } catch (error) {
      this.logger.error(`Error updating job status for ${id}`, error);
      throw error;
    }
  }

  async deleteJob(id: string) {
    try {
      const result = await this.jobRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Job not found');
      }

      this.logger.log(`Job ${id} deleted`);
    } catch (error) {
      this.logger.error(`Error deleting job ${id}`, error);
      throw error;
    }
  }

  // ===== COMPANY MANAGEMENT =====
  async getAllCompanies(query: CompanyQuery) {
    try {
      const { page = 1, limit = 10, status, search } = query;
      const skip = (page - 1) * limit;

      let qb = this.companyRepository.createQueryBuilder('company');

      if (status) {
        qb = qb.andWhere('company.status = :status', { status });
      }

      if (search) {
        qb = qb.andWhere(
          '(company.name LIKE :search OR company.description LIKE :search OR company.website LIKE :search)',
          { search: `%${search}%` },
        );
      }

      const [companies, total] = await qb
        .orderBy('company.createdAt', 'DESC')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return {
        data: companies,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error('Error getting all companies', error);
      throw error;
    }
  }

  async updateCompanyStatus(id: string, status: string, reason?: string) {
    try {
      const company = await this.companyRepository.findOne({ where: { id } });
      if (!company) {
        throw new NotFoundException('Company not found');
      }

      company.status = status;
      if (reason) {
        // Could add a reason field to Company entity
      }

      await this.companyRepository.save(company);

      this.logger.log(`Company ${id} status updated to ${status}`);
      return { message: 'Company status updated successfully' };
    } catch (error) {
      this.logger.error(`Error updating company status for ${id}`, error);
      throw error;
    }
  }

  async verifyCompany(id: string, isVerified: boolean, adminNotes?: string) {
    try {
      const company = await this.companyRepository.findOne({
        where: { id },
        relations: ['owner'],
      });
      if (!company) {
        throw new NotFoundException('Company not found');
      }

      company.isVerified = isVerified;
      company.verifiedAt = isVerified ? new Date() : undefined;
      company.adminNotes = adminNotes || undefined;

      await this.companyRepository.save(company);

      this.logger.log(
        `Company ${id} verification status updated to ${isVerified}`,
      );

      // Send notification to company owner
      try {
        const notificationMessage = isVerified
          ? `Công ty ${company.name} của bạn đã được xác minh thành công. Giờ bạn có thể đăng tin tuyển dụng với mức độ hiển thị cao hơn.`
          : `Công ty ${company.name} của bạn chưa được xác minh. Vui lòng cập nhật thông tin công ty để được xác minh.`;

        // Import NotificationsService to send notification
        // Note: This would need to be injected into the constructor
        // For now, we'll just log the notification
        this.logger.log(
          `Notification to ${company.owner.email}: ${notificationMessage}`,
        );
      } catch (notificationError) {
        this.logger.error(
          'Failed to send verification notification',
          notificationError,
        );
      }

      return {
        message: `Company ${isVerified ? 'verified' : 'unverified'} successfully`,
        company: {
          id: company.id,
          name: company.name,
          isVerified: company.isVerified,
          verifiedAt: company.verifiedAt,
        },
      };
    } catch (error) {
      this.logger.error(`Error verifying company ${id}`, error);
      throw error;
    }
  }

  async getPendingCompanyVerifications() {
    try {
      const pendingCompanies = await this.companyRepository.find({
        where: { isVerified: false },
        relations: ['owner'],
        order: { createdAt: 'ASC' },
      });

      return {
        data: pendingCompanies,
        total: pendingCompanies.length,
      };
    } catch (error) {
      this.logger.error('Error getting pending company verifications', error);
      throw error;
    }
  }

  async deleteCompany(id: string) {
    try {
      const result = await this.companyRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Company not found');
      }

      this.logger.log(`Company ${id} deleted`);
    } catch (error) {
      this.logger.error(`Error deleting company ${id}`, error);
      throw error;
    }
  }

  // ===== APPLICATION MANAGEMENT =====
  async getAllApplications(query: ApplicationQuery) {
    try {
      const { page = 1, limit = 10, status, jobId, userId } = query;
      const skip = (page - 1) * limit;

      let qb = this.applicationRepository
        .createQueryBuilder('application')
        .leftJoinAndSelect('application.jobSeekerProfile', 'jobSeekerProfile')
        .leftJoinAndSelect('jobSeekerProfile.user', 'user')
        .leftJoinAndSelect('application.job', 'job')
        .leftJoinAndSelect('job.company', 'company');

      if (status) {
        qb = qb.andWhere('application.status = :status', { status });
      }

      if (jobId) {
        qb = qb.andWhere('application.jobId = :jobId', { jobId });
      }

      if (userId) {
        // Find job seeker profile for userId and filter by jobSeekerProfileId
        const jobSeekerProfile = await this.userRepository
          .findOne({
            where: { id: userId },
            relations: ['jobSeekerProfiles'],
          })
          .then((user) => user?.jobSeekerProfiles?.[0]);

        if (jobSeekerProfile) {
          qb = qb.andWhere(
            'application.jobSeekerProfileId = :jobSeekerProfileId',
            {
              jobSeekerProfileId: jobSeekerProfile.id,
            },
          );
        }
      }

      const [applications, total] = await qb
        .orderBy('application.createdAt', 'DESC')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return {
        data: applications,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error('Error getting all applications', error);
      throw error;
    }
  }

  async updateApplicationStatus(id: string, status: string, notes?: string) {
    try {
      const application = await this.applicationRepository.findOne({
        where: { id },
      });
      if (!application) {
        throw new NotFoundException('Application not found');
      }

      // Validate status is a valid ApplicationStatus enum value
      if (
        !Object.values(ApplicationStatus).includes(status as ApplicationStatus)
      ) {
        throw new BadRequestException(`Invalid application status: ${status}`);
      }

      application.status = status as ApplicationStatus;
      if (notes) {
        application.notes = notes;
      }

      await this.applicationRepository.save(application);

      this.logger.log(`Application ${id} status updated to ${status}`);
      return { message: 'Application status updated successfully' };
    } catch (error) {
      this.logger.error(`Error updating application status for ${id}`, error);
      throw error;
    }
  }

  // ===== CONTENT MANAGEMENT =====
  async getAllSkills(query: SkillQuery) {
    try {
      const { page = 1, limit = 10, search } = query;
      const skip = (page - 1) * limit;

      let qb = this.skillRepository.createQueryBuilder('skill');

      if (search) {
        qb = qb.andWhere(
          '(skill.name LIKE :search OR skill.description LIKE :search)',
          { search: `%${search}%` },
        );
      }

      const [skills, total] = await qb
        .orderBy('skill.name', 'ASC')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      // Get usage statistics for each skill
      const skillsWithStats = await Promise.all(
        skills.map(async (skill) => {
          try {
            const usageCount = await this.skillRepository
              .createQueryBuilder('skill')
              .leftJoin('skill.jobSeekerSkills', 'jss')
              .where('skill.id = :skillId', { skillId: skill.id })
              .getCount();

            return {
              ...skill,
              usageCount,
            };
          } catch (error) {
            // If relationship query fails, return skill with usageCount 0
            console.warn(
              `Failed to get usage count for skill ${skill.id}:`,
              error.message,
            );
            return {
              ...skill,
              usageCount: 0,
            };
          }
        }),
      );

      return {
        data: skillsWithStats,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error('Error getting all skills', error);
      throw error;
    }
  }

  async createSkill(data: {
    name: string;
    description?: string;
    category?: string;
  }) {
    try {
      const skill = this.skillRepository.create(data);
      const savedSkill = await this.skillRepository.save(skill);

      this.logger.log(`Skill ${savedSkill.name} created`);
      return savedSkill;
    } catch (error) {
      this.logger.error('Error creating skill', error);
      throw error;
    }
  }

  async updateSkill(
    id: string,
    data: { name?: string; description?: string; category?: string },
  ) {
    try {
      const result = await this.skillRepository.update(id, data);
      if (result.affected === 0) {
        throw new NotFoundException('Skill not found');
      }

      this.logger.log(`Skill ${id} updated`);
      return { message: 'Skill updated successfully' };
    } catch (error) {
      this.logger.error(`Error updating skill ${id}`, error);
      throw error;
    }
  }

  async deleteSkill(id: string) {
    try {
      const result = await this.skillRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Skill not found');
      }

      this.logger.log(`Skill ${id} deleted`);
    } catch (error) {
      this.logger.error(`Error deleting skill ${id}`, error);
      throw error;
    }
  }

  async getAllJobCategories(query: JobCategoryQuery) {
    try {
      const { page = 1, limit = 10, search } = query;
      const skip = (page - 1) * limit;

      let qb = this.jobCategoryRepository.createQueryBuilder('category');

      if (search) {
        qb = qb.andWhere(
          '(category.name LIKE :search OR category.description LIKE :search)',
          { search: `%${search}%` },
        );
      }

      const [categories, total] = await qb
        .orderBy('category.name', 'ASC')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      // Get usage statistics for each category
      const categoriesWithStats = await Promise.all(
        categories.map(async (category) => {
          const usageCount = await this.jobCategoryRepository
            .createQueryBuilder('category')
            .leftJoin('category.jobs', 'jobs')
            .where('category.id = :categoryId', { categoryId: category.id })
            .getCount();

          return {
            ...category,
            usageCount,
          };
        }),
      );

      return {
        data: categoriesWithStats,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error('Error getting all job categories', error);
      throw error;
    }
  }

  async createJobCategory(data: { name: string; description?: string }) {
    try {
      const category = this.jobCategoryRepository.create(data);
      const savedCategory = await this.jobCategoryRepository.save(category);

      this.logger.log(`Job category ${savedCategory.name} created`);
      return savedCategory;
    } catch (error) {
      this.logger.error('Error creating job category', error);
      throw error;
    }
  }

  async updateJobCategory(
    id: string,
    data: { name?: string; description?: string },
  ) {
    try {
      const result = await this.jobCategoryRepository.update(id, data);
      if (result.affected === 0) {
        throw new NotFoundException('Job category not found');
      }

      this.logger.log(`Job category ${id} updated`);
      return { message: 'Job category updated successfully' };
    } catch (error) {
      this.logger.error(`Error updating job category ${id}`, error);
      throw error;
    }
  }

  async deleteJobCategory(id: string) {
    try {
      const result = await this.jobCategoryRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Job category not found');
      }

      this.logger.log(`Job category ${id} deleted`);
    } catch (error) {
      this.logger.error(`Error deleting job category ${id}`, error);
      throw error;
    }
  }

  // ===== CONTENT MANAGEMENT STATS =====
  async getContentStats() {
    try {
      const today = new Date();
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Skills statistics
      const totalSkills = await this.skillRepository.count();
      const skillsThisMonth = await this.skillRepository
        .createQueryBuilder('skill')
        .where('skill.createdAt >= :thisMonth AND skill.createdAt <= :today', {
          thisMonth,
          today,
        })
        .getCount();

      // Categories statistics
      const totalCategories = await this.jobCategoryRepository.count();
      const categoriesThisMonth = await this.jobCategoryRepository
        .createQueryBuilder('category')
        .where(
          'category.createdAt >= :thisMonth AND category.createdAt <= :today',
          {
            thisMonth,
            today,
          },
        )
        .getCount();

      return {
        totalSkills,
        totalCategories,
        skillsThisMonth,
        categoriesThisMonth,
      };
    } catch (error) {
      this.logger.error('Error getting content stats', error);
      throw error;
    }
  }

  // ===== SYSTEM MANAGEMENT =====
  async getSystemInfo() {
    try {
      const os = await import('os');
      const fs = await import('fs');
      const path = await import('path');

      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const packageJson: PackageJson = JSON.parse(packageJsonContent);

      return {
        version: packageJson.version,
        uptime: Math.floor(process.uptime()),
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          external: Math.round(process.memoryUsage().external / 1024 / 1024),
        },
        database: {
          status: 'connected', // Would implement actual DB health check
          connectionPool: 'active', // Would get actual pool status
        },
        environment: process.env.NODE_ENV || 'development',
        platform: {
          nodeVersion: process.version,
          platform: os.platform(),
          arch: os.arch(),
          cpus: os.cpus().length,
        },
      };
    } catch (error) {
      this.logger.error('Error getting system info', error);
      throw error;
    }
  }

  async runMaintenanceTask(task: string) {
    try {
      switch (task) {
        case 'cleanup-expired-jobs': {
          const expiredJobsResult = await this.jobRepository.update(
            {
              status: JobStatus.PUBLISHED,
              expiresAt: LessThanOrEqual(new Date()),
            },
            { status: JobStatus.EXPIRED },
          );
          return {
            message: `Cleaned up ${expiredJobsResult.affected} expired jobs`,
          };
        }

        case 'cleanup-old-notifications': {
          const oldNotificationsResult =
            await this.notificationRepository.delete({
              createdAt: LessThanOrEqual(
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
              ),
            });
          return {
            message: `Cleaned up ${oldNotificationsResult.affected} old notifications`,
          };
        }

        case 'reindex-database':
          // Would implement database reindexing
          return { message: 'Database reindexing completed' };

        case 'backup-database':
          // Would implement database backup
          return { message: 'Database backup completed' };

        default:
          throw new BadRequestException('Unknown maintenance task');
      }
    } catch (error) {
      this.logger.error(`Error running maintenance task ${task}`, error);
      throw error;
    }
  }

  getSystemLogs(query: SystemLogsQuery) {
    try {
      // This is a simplified implementation
      // In a real application, you would read from log files or a logging service
      const logs = [
        {
          timestamp: new Date(),
          level: 'info',
          message: 'System maintenance completed',
          source: 'admin-service',
        },
        {
          timestamp: new Date(Date.now() - 3600000),
          level: 'warn',
          message: 'High memory usage detected',
          source: 'system-monitor',
        },
      ];

      return {
        data: logs.slice(0, query.limit || 100),
        total: logs.length,
      };
    } catch (error) {
      this.logger.error('Error getting system logs', error);
      throw error;
    }
  }

  // ===== ANALYTICS & REPORTS =====
  async getUserActivityReport(query: AnalyticsQuery) {
    try {
      const startDate = query.startDate
        ? new Date(query.startDate)
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = query.endDate ? new Date(query.endDate) : new Date();

      const userActivity: any[] = await this.userRepository
        .createQueryBuilder('user')
        .select('DATE(user.createdAt)', 'date')
        .addSelect('COUNT(*)', 'registrations')
        .where('user.createdAt BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        })
        .groupBy('DATE(user.createdAt)')
        .orderBy('DATE(user.createdAt)', 'ASC')
        .getRawMany();

      return {
        data: userActivity,
        startDate,
        endDate,
      };
    } catch (error) {
      this.logger.error('Error getting user activity report', error);
      throw error;
    }
  }

  async getJobMarketReport(query: AnalyticsQuery) {
    try {
      const startDate = query.startDate
        ? new Date(query.startDate)
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = query.endDate ? new Date(query.endDate) : new Date();

      // Job postings by category
      const jobsByCategory: any[] = await this.jobRepository
        .createQueryBuilder('job')
        .leftJoin('job.category', 'category')
        .select('category.name', 'categoryName')
        .addSelect('COUNT(*)', 'count')
        .where('job.createdAt BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        })
        .groupBy('category.id')
        .orderBy('count', 'DESC')
        .getRawMany();

      // Applications per job
      const applicationsPerJob: any[] = await this.jobRepository
        .createQueryBuilder('job')
        .leftJoin('job.applications', 'applications')
        .select('job.title', 'jobTitle')
        .addSelect('COUNT(applications.id)', 'applicationCount')
        .where('job.createdAt BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        })
        .groupBy('job.id')
        .orderBy('applicationCount', 'DESC')
        .limit(10)
        .getRawMany();

      return {
        jobsByCategory,
        applicationsPerJob,
        startDate,
        endDate,
      };
    } catch (error) {
      this.logger.error('Error getting job market report', error);
      throw error;
    }
  }

  async getRevenueReport(query: RevenueQuery) {
    try {
      const startDate = query.startDate
        ? new Date(query.startDate)
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = query.endDate ? new Date(query.endDate) : new Date();
      const groupBy = query.groupBy || 'day';

      let dateFormat: string;
      switch (groupBy) {
        case 'month':
          dateFormat = 'DATE_FORMAT(payment.createdAt, "%Y-%m")';
          break;
        case 'week':
          dateFormat = 'DATE_FORMAT(payment.createdAt, "%Y-%U")';
          break;
        default:
          dateFormat = 'DATE(payment.createdAt)';
      }

      const revenueData: any[] = await this.paymentRepository
        .createQueryBuilder('payment')
        .select(dateFormat, 'date')
        .addSelect('SUM(payment.amount)', 'revenue')
        .addSelect('COUNT(*)', 'transactions')
        .where('payment.status = :status', { status: 'completed' })
        .andWhere('payment.createdAt BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        })
        .groupBy(dateFormat)
        .orderBy(dateFormat, 'ASC')
        .getRawMany();

      return {
        data: revenueData,
        startDate,
        endDate,
        groupBy,
      };
    } catch (error) {
      this.logger.error('Error getting revenue report', error);
      throw error;
    }
  }

  // ===== BLOG COMMENT MODERATION =====

  async getPendingBlogComments(): Promise<{
    data: BlogComment[];
    total: number;
  }> {
    const pendingComments = await this.blogCommentRepository.find({
      where: { isApproved: false },
      relations: ['blog', 'author', 'parent'],
      order: { createdAt: 'ASC' },
    });

    return {
      data: pendingComments,
      total: pendingComments.length,
    };
  }

  async approveBlogComment(commentId: string): Promise<BlogComment> {
    const comment = await this.blogCommentRepository.findOne({
      where: { id: commentId },
      relations: ['blog', 'author', 'parent'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.isApproved) {
      throw new BadRequestException('Comment is already approved');
    }

    comment.approve();
    const approvedComment = await this.blogCommentRepository.save(comment);

    this.logger.log(`Blog comment ${commentId} approved by admin`);
    return approvedComment;
  }

  async rejectBlogComment(commentId: string): Promise<void> {
    const comment = await this.blogCommentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.isApproved) {
      throw new BadRequestException('Cannot reject approved comments');
    }

    await this.blogCommentRepository.remove(comment);
    this.logger.log(`Blog comment ${commentId} rejected by admin`);
  }

  async bulkApproveBlogComments(commentIds: string[]): Promise<{
    approved: number;
    failed: number;
  }> {
    let approved = 0;
    let failed = 0;

    for (const commentId of commentIds) {
      try {
        await this.approveBlogComment(commentId);
        approved++;
    } catch (error) {
      this.logger.error(
        `Failed to approve comment ${commentId}:`,
        error instanceof Error ? error.message : 'Unknown error',
      );
      failed++;
    }
    }

    this.logger.log(`Bulk approved ${approved} comments, ${failed} failed`);
    return { approved, failed };
  }

  async bulkRejectBlogComments(commentIds: string[]): Promise<{
    rejected: number;
    failed: number;
  }> {
    let rejected = 0;
    let failed = 0;

    for (const commentId of commentIds) {
      try {
        await this.rejectBlogComment(commentId);
        rejected++;
      } catch (error) {
        this.logger.error(
          `Failed to reject comment ${commentId}:`,
          error instanceof Error ? error.message : 'Unknown error',
        );
        failed++;
      }
    }

    this.logger.log(`Bulk rejected ${rejected} comments, ${failed} failed`);
    return { rejected, failed };
  }

  async getApprovedBlogComments(query: any = {}): Promise<{
    data: BlogComment[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, blogId } = query;
    const skip = (page - 1) * limit;

    const where: any = { isApproved: true };
    if (blogId) {
      where.blogId = blogId;
    }

    const [comments, total] = await this.blogCommentRepository.findAndCount({
      where,
      relations: ['blog', 'author', 'parent'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: comments,
      total,
      page: +page,
      limit: +limit,
    };
  }

  // ===== HELPER METHODS =====
  private async getUserStatistics(userId: string) {
    try {
      // Find job seeker profile for the user to count applications
      const jobSeekerProfile = await this.userRepository
        .findOne({
          where: { id: userId },
          relations: ['jobSeekerProfiles'],
        })
        .then((user) => user?.jobSeekerProfiles?.[0]);

      const jobSeekerProfileId = jobSeekerProfile?.id;

      // Count applications for this user's job seeker profile
      const totalApplications = jobSeekerProfileId
        ? await this.applicationRepository.count({
            where: { jobSeekerProfileId },
          })
        : 0;

      // Count jobs posted by this user (through their company)
      const totalJobsPosted = await this.jobRepository.count({
        where: { postedById: userId },
      });

      const activeJobs = await this.jobRepository.count({
        where: {
          postedById: userId,
          status: JobStatus.PUBLISHED,
        },
      });

      return {
        totalApplications,
        totalJobsPosted,
        activeJobs,
      };
    } catch (error) {
      this.logger.error(`Error getting statistics for user ${userId}`, error);
      return {
        totalApplications: 0,
        totalJobsPosted: 0,
        activeJobs: 0,
      };
    }
  }
}

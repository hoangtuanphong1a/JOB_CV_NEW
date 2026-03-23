import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { User, UserStatus } from './modules/common/entities/user.entity';
import {
  Role,
  RoleName,
  Permission,
} from './modules/common/entities/role.entity';
import { UserRole } from './modules/common/entities/user-role.entity';
import { Company } from './modules/common/entities/company.entity';
import {
  Job,
  JobStatus,
  JobType,
  ExperienceLevel,
  SalaryType,
} from './modules/common/entities/job.entity';
import {
  Application,
  ApplicationStatus,
  ApplicationSource,
} from './modules/common/entities/application.entity';
import {
  JobSeekerProfile,
  EmploymentStatus,
} from './modules/common/entities/job-seeker-profile.entity';
import { Skill } from './modules/common/entities/skill.entity';
import { JobCategory } from './modules/common/entities/job-category.entity';
import { SavedJob } from './modules/common/entities/saved-job.entity';
import { Blog, BlogStatus } from './modules/common/entities/blog.entity';
import {
  Notification,
  NotificationType,
  NotificationChannel,
} from './modules/common/entities/notification.entity';
import { MessageThread } from './modules/common/entities/message-thread.entity';
import {
  ThreadParticipant,
  ParticipantRole,
} from './modules/common/entities/thread-participant.entity';
import {
  Message,
  MessageType,
  MessageStatus,
} from './modules/common/entities/message.entity';
import { HRCompanyRelationship } from './modules/hr-company-relationship/hr-company-relationship.entity';
import {
  SubscriptionPlan,
  PlanType,
  BillingCycle,
} from './modules/common/entities/subscription-plan.entity';
import { File, FileType } from './modules/upload/entities/file.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data (in reverse order of dependencies)
    console.log('🗑️  Clearing existing data...');
    await dataSource.getRepository(Message).clear();
    await dataSource.getRepository(ThreadParticipant).clear();
    await dataSource.getRepository(MessageThread).clear();
    await dataSource.getRepository(Notification).clear();
    await dataSource.getRepository(SavedJob).clear();
    await dataSource.getRepository(Application).clear();
    await dataSource.getRepository(Job).clear();
    await dataSource.getRepository(JobSeekerProfile).clear();
    await dataSource.getRepository(HRCompanyRelationship).clear();
    await dataSource.getRepository(Company).clear();
    await dataSource.getRepository(Blog).clear();
    await dataSource.getRepository(UserRole).clear();
    await dataSource.getRepository(User).clear();
    await dataSource.getRepository(Role).clear();
    await dataSource.getRepository(Skill).clear();
    await dataSource.getRepository(JobCategory).clear();
    await dataSource.getRepository(SubscriptionPlan).clear();
    await dataSource.getRepository(File).clear();

    // 1. Create Roles
    console.log('👤 Creating roles...');
    const adminRole = await dataSource.getRepository(Role).save({
      name: RoleName.ADMIN,
      description: 'Administrator with full access',
      permissions: Object.values(Permission),
    });

    const employerRole = await dataSource.getRepository(Role).save({
      name: RoleName.EMPLOYER,
      description: 'Company employer/owner',
      permissions: [
        Permission.CREATE_COMPANY_PROFILE,
        Permission.MANAGE_COMPANY_PROFILE,
      ],
    });

    const hrRole = await dataSource.getRepository(Role).save({
      name: RoleName.HR,
      description: 'HR specialist',
      permissions: [
        Permission.VIEW_COMPANY_APPLICATIONS,
        Permission.PROCESS_CANDIDATES,
      ],
    });

    const jobSeekerRole = await dataSource.getRepository(Role).save({
      name: RoleName.JOB_SEEKER,
      description: 'Job seeker',
      permissions: [Permission.APPLY_TO_JOBS, Permission.SAVE_JOBS],
    });

    // 2. Create Users
    console.log('👥 Creating users...');
    const adminUser = await dataSource.getRepository(User).save({
      email: 'admin@example.com',
      password: '$2b$10$hashedpassword', // Will be hashed by BeforeInsert
      firstName: 'Admin',
      lastName: 'User',
      status: UserStatus.ACTIVE,
    });

    const employerUser = await dataSource.getRepository(User).save({
      email: 'employer@example.com',
      password: '$2b$10$hashedpassword',
      firstName: 'John',
      lastName: 'Employer',
      status: UserStatus.ACTIVE,
    });

    const hrUser = await dataSource.getRepository(User).save({
      email: 'hr@example.com',
      password: '$2b$10$hashedpassword',
      firstName: 'Sarah',
      lastName: 'HR',
      status: UserStatus.ACTIVE,
    });

    const jobSeekerUser = await dataSource.getRepository(User).save({
      email: 'jobseeker@example.com',
      password: '$2b$10$hashedpassword',
      firstName: 'Mike',
      lastName: 'Developer',
      status: UserStatus.ACTIVE,
    });

    // 3. Assign User Roles
    console.log('🔗 Assigning user roles...');
    await dataSource.getRepository(UserRole).save([
      { user: adminUser, role: adminRole },
      { user: employerUser, role: employerRole },
      { user: hrUser, role: hrRole },
      { user: jobSeekerUser, role: jobSeekerRole },
    ]);

    // 4. Create Companies
    console.log('🏢 Creating companies...');
    const techCorp = await dataSource.getRepository(Company).save({
      name: 'Tech Corp Vietnam',
      description: 'Leading technology company in Vietnam',
      website: 'https://techcorp.vn',
      email: 'hr@techcorp.vn',
      phone: '+84-123-456-789',
      address: '123 Tech Street, Ho Chi Minh City',
      ownerId: employerUser.id,
      owner: employerUser,
    });

    const startupInc = await dataSource.getRepository(Company).save({
      name: 'Startup Inc',
      description: 'Innovative startup building the future',
      website: 'https://startupinc.com',
      email: 'jobs@startupinc.com',
      phone: '+84-987-654-321',
      address: '456 Innovation Ave, Hanoi',
      ownerId: employerUser.id,
      owner: employerUser,
    });

    // 5. Create HR-Company Relationships
    console.log('🤝 Creating HR-Company relationships...');
    await dataSource.getRepository(HRCompanyRelationship).save({
      hrUserId: hrUser.id,
      companyId: techCorp.id,
      hrRole: 'Senior HR Manager',
      permissions: { canHire: true, canPostJobs: true },
      isActive: true,
    });

    // 6. Create Job Categories
    console.log('📂 Creating job categories...');
    const softwareDev = await dataSource.getRepository(JobCategory).save({
      name: 'Software Development',
      description: 'Software engineering and development roles',
    });

    const design = await dataSource.getRepository(JobCategory).save({
      name: 'Design',
      description: 'UI/UX and graphic design roles',
    });

    const marketing = await dataSource.getRepository(JobCategory).save({
      name: 'Marketing',
      description: 'Marketing and growth roles',
    });

    // 7. Create Skills
    console.log('🛠️ Creating skills...');
    const javascript = await dataSource.getRepository(Skill).save({
      name: 'JavaScript',
      description: 'JavaScript programming language',
      category: 'Programming Languages',
    });

    const react = await dataSource.getRepository(Skill).save({
      name: 'React',
      description: 'React JavaScript library',
      category: 'Frontend Frameworks',
    });

    const nodejs = await dataSource.getRepository(Skill).save({
      name: 'Node.js',
      description: 'Node.js runtime environment',
      category: 'Backend Technologies',
    });

    const python = await dataSource.getRepository(Skill).save({
      name: 'Python',
      description: 'Python programming language',
      category: 'Programming Languages',
    });

    // 8. Create Jobs
    console.log('💼 Creating jobs...');
    const seniorDevJob = await dataSource.getRepository(Job).save({
      title: 'Senior Full Stack Developer',
      description:
        'We are looking for an experienced full stack developer to join our growing team...',
      requirements: '5+ years experience, React, Node.js, TypeScript',
      benefits: 'Competitive salary, health insurance, flexible work hours',
      jobType: JobType.FULL_TIME,
      experienceLevel: ExperienceLevel.SENIOR,
      salaryType: SalaryType.YEARLY,
      minSalary: 80000,
      maxSalary: 120000,
      currency: 'USD',
      city: 'Ho Chi Minh City',
      country: 'Vietnam',
      remoteWork: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      status: JobStatus.PUBLISHED,
      companyId: techCorp.id,
      company: techCorp,
      categoryId: softwareDev.id,
      postedById: employerUser.id,
      applicationCount: 0,
      viewCount: 0,
    });

    const juniorDevJob = await dataSource.getRepository(Job).save({
      title: 'Junior Frontend Developer',
      description:
        'Great opportunity for junior developers to grow their skills...',
      requirements: '1-2 years experience, HTML, CSS, JavaScript',
      benefits: 'Mentorship program, learning budget, flexible hours',
      jobType: JobType.FULL_TIME,
      experienceLevel: ExperienceLevel.JUNIOR,
      salaryType: SalaryType.YEARLY,
      minSalary: 30000,
      maxSalary: 45000,
      currency: 'USD',
      city: 'Hanoi',
      country: 'Vietnam',
      remoteWork: false,
      expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
      status: JobStatus.PUBLISHED,
      companyId: startupInc.id,
      company: startupInc,
      categoryId: softwareDev.id,
      postedById: employerUser.id,
      applicationCount: 0,
      viewCount: 0,
    });

    // 9. Create Job Seeker Profile
    console.log('👔 Creating job seeker profile...');
    const jobSeekerProfile = await dataSource
      .getRepository(JobSeekerProfile)
      .save({
        userId: jobSeekerUser.id,
        user: jobSeekerUser,
        fullName: 'Mike Developer',
        email: jobSeekerUser.email,
        phone: '+84-555-123-456',
        title: 'Full Stack Developer',
        summary:
          'Passionate full stack developer with 3 years of experience building web applications.',
        currentPosition: 'Frontend Developer',
        currentCompany: 'Tech Startup',
        employmentStatus: EmploymentStatus.EMPLOYED,
        expectedSalaryMin: 50000,
        expectedSalaryMax: 70000,
        expectedSalaryCurrency: 'USD',
        preferredLocation: 'Ho Chi Minh City, Vietnam',
        willingToRelocate: true,
        remoteWorkPreferred: true,
        linkedinUrl: 'https://linkedin.com/in/mike-developer',
        githubUrl: 'https://github.com/mike-developer',
        portfolioUrl: 'https://mike-developer.dev',
        profileCompletion: 85,
        lastUpdatedAt: new Date(),
      });

    // 10. Create Applications
    console.log('📝 Creating applications...');
    const application1 = await dataSource.getRepository(Application).save({
      jobId: seniorDevJob.id,
      job: seniorDevJob,
      jobSeekerProfileId: jobSeekerProfile.id,
      jobSeekerProfile: jobSeekerProfile,
      coverLetter: 'I am very excited to apply for this position...',
      resumeUrl: 'https://example.com/resume.pdf',
      status: ApplicationStatus.PENDING,
      source: ApplicationSource.WEBSITE,
      viewCount: 0,
    });

    const application2 = await dataSource.getRepository(Application).save({
      jobId: juniorDevJob.id,
      job: juniorDevJob,
      jobSeekerProfileId: jobSeekerProfile.id,
      jobSeekerProfile: jobSeekerProfile,
      coverLetter:
        'I believe my skills would be a great fit for this junior role...',
      status: ApplicationStatus.REVIEWED,
      source: ApplicationSource.WEBSITE,
      reviewedAt: new Date(),
      reviewedById: hrUser.id,
      viewCount: 1,
    });

    // 11. Create Saved Jobs
    console.log('💾 Creating saved jobs...');
    await dataSource.getRepository(SavedJob).save({
      user: jobSeekerUser,
      job: seniorDevJob,
    });

    // 12. Create Blog Posts
    console.log('📝 Creating blog posts...');
    await dataSource.getRepository(Blog).save({
      title: 'How to Succeed in Tech Interviews',
      content:
        'Technical interviews can be challenging, but with the right preparation...',
      excerpt: 'Tips and strategies for acing your next technical interview',
      slug: 'how-to-succeed-tech-interviews',
      status: BlogStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: employerUser.id,
      author: employerUser,
      tags: ['career', 'interview', 'tips'],
      readTime: 5,
      viewCount: 0,
      likeCount: 0,
    });

    // 13. Create Notifications
    console.log('🔔 Creating notifications...');
    await dataSource.getRepository(Notification).save([
      {
        userId: jobSeekerUser.id,
        type: NotificationType.APPLICATION_STATUS_CHANGED,
        title: 'Application Status Updated',
        message:
          'Your application for Senior Full Stack Developer has been moved to reviewing.',
        channel: NotificationChannel.IN_APP,
        priority: 2,
        isRead: false,
        relatedEntityId: application2.id,
        relatedEntityType: 'application',
      },
      {
        userId: employerUser.id,
        type: NotificationType.APPLICATION_RECEIVED,
        title: 'New Application Received',
        message:
          'Mike Developer applied for Senior Full Stack Developer position.',
        channel: NotificationChannel.IN_APP,
        priority: 3,
        isRead: false,
        relatedEntityId: application1.id,
        relatedEntityType: 'application',
      },
    ]);

    // 14. Create Message Thread
    console.log('💬 Creating message thread...');
    const messageThread = await dataSource.getRepository(MessageThread).save({
      createdAt: new Date(),
      lastMessageAt: new Date(),
    });

    // 15. Create Thread Participants
    await dataSource.getRepository(ThreadParticipant).save([
      {
        threadId: messageThread.id,
        userId: employerUser.id,
        role: ParticipantRole.OWNER,
      },
      {
        threadId: messageThread.id,
        userId: jobSeekerUser.id,
        role: ParticipantRole.MEMBER,
      },
    ]);

    // 16. Create Messages
    await dataSource.getRepository(Message).save([
      {
        threadId: messageThread.id,
        senderUserId: employerUser.id,
        body: "Hi Mike, thank you for applying to our Senior Full Stack Developer position. We'd like to schedule an interview.",
        messageType: MessageType.TEXT,
        status: MessageStatus.SENT,
        sentAt: new Date(),
        isRead: false,
      },
      {
        threadId: messageThread.id,
        senderUserId: jobSeekerUser.id,
        body: "Hi, thank you for considering my application. I'm available for an interview next week.",
        messageType: MessageType.TEXT,
        status: MessageStatus.SENT,
        sentAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes later
        isRead: false,
      },
    ]);

    // 17. Create Subscription Plans
    console.log('💳 Creating subscription plans...');
    await dataSource.getRepository(SubscriptionPlan).save([
      {
        name: 'Free Plan',
        description: 'Basic features for getting started',
        planType: PlanType.FREE,
        price: 0,
        billingCycle: BillingCycle.MONTHLY,
        maxJobs: 1,
        maxApplications: 10,
        featured: false,
        prioritySupport: false,
        analyticsAccess: false,
        features: ['Basic job posting', 'Application tracking'],
        isActive: true,
        sortOrder: 1,
      },
      {
        name: 'Premium Plan',
        description: 'Advanced features for growing companies',
        planType: PlanType.PREMIUM,
        price: 49.99,
        billingCycle: BillingCycle.MONTHLY,
        maxJobs: 10,
        maxApplications: 100,
        featured: true,
        prioritySupport: true,
        analyticsAccess: true,
        features: [
          'Unlimited job postings',
          'Advanced analytics',
          'Priority support',
          'Custom branding',
        ],
        isActive: true,
        sortOrder: 2,
      },
    ]);

    // 18. Create Files
    console.log('📁 Creating files...');
    await dataSource.getRepository(File).save([
      {
        originalName: 'company-logo.png',
        filename: 'company-logo-123.png',
        mimeType: 'image/png',
        size: 1024000, // 1MB
        fileType: FileType.COMPANY_LOGO,
        path: '/uploads/company-logos/company-logo-123.png',
        url: 'https://cdn.example.com/uploads/company-logos/company-logo-123.png',
        uploadedById: employerUser.id,
        uploadedBy: employerUser,
        isPublic: true,
        altText: 'Tech Corp Logo',
        description: 'Company logo for Tech Corp',
      },
      {
        originalName: 'resume-mike.pdf',
        filename: 'resume-mike-456.pdf',
        mimeType: 'application/pdf',
        size: 2048000, // 2MB
        fileType: FileType.CV_DOCUMENT,
        path: '/uploads/cvs/resume-mike-456.pdf',
        url: 'https://cdn.example.com/uploads/cvs/resume-mike-456.pdf',
        uploadedById: jobSeekerUser.id,
        uploadedBy: jobSeekerUser,
        isPublic: false,
        description: "Mike Developer's resume",
      },
    ]);

    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Summary of seeded data:');
    console.log('- 4 Users (Admin, Employer, HR, Job Seeker)');
    console.log('- 4 Roles with permissions');
    console.log('- 2 Companies');
    console.log('- 1 HR-Company relationship');
    console.log('- 3 Job categories');
    console.log('- 4 Skills');
    console.log('- 2 Jobs');
    console.log('- 1 Job Seeker profile');
    console.log('- 2 Applications');
    console.log('- 1 Saved job');
    console.log('- 1 Blog post');
    console.log('- 2 Notifications');
    console.log('- 1 Message thread with 2 messages');
    console.log('- 2 Subscription plans');
    console.log('- 2 Files');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await app.close();
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log('🎉 Seeding process finished!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding process failed:', error);
    process.exit(1);
  });

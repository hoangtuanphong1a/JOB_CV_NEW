import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserRole } from './user-role.entity';
// import { UserRole } from './user-role.entity';

export enum RoleName {
  ADMIN = 'admin',
  EMPLOYER = 'employer',
  HR = 'hr',
  JOB_SEEKER = 'job_seeker',
}

export enum Permission {
  // Admin permissions - Full system access
  MANAGE_USERS = 'manage_users',
  MANAGE_ROLES = 'manage_roles',
  MANAGE_COMPANIES = 'manage_companies',
  APPROVE_COMPANIES = 'approve_companies',
  MANAGE_JOBS = 'manage_jobs',
  MODERATE_CONTENT = 'moderate_content',
  MANAGE_PACKAGES = 'manage_packages',
  MANAGE_PAYMENTS = 'manage_payments',
  VIEW_ANALYTICS = 'view_analytics',
  SYSTEM_CONFIG = 'system_config',
  SYSTEM_MONITORING = 'system_monitoring',

  // Employer permissions - Company management
  CREATE_COMPANY_PROFILE = 'create_company_profile',
  MANAGE_COMPANY_PROFILE = 'manage_company_profile',
  POST_JOBS = 'post_jobs',
  MANAGE_JOB_POSTINGS = 'manage_job_postings',
  VIEW_COMPANY_APPLICATIONS = 'view_company_applications',
  MANAGE_COMPANY_HR = 'manage_company_hr',
  VIEW_RECRUITMENT_REPORTS = 'view_recruitment_reports',
  UPGRADE_PACKAGES = 'upgrade_packages',

  // HR permissions - Recruitment within company
  VIEW_COMPANY_JOBS = 'view_company_jobs',
  PROCESS_CANDIDATES = 'process_candidates',
  REVIEW_RESUMES = 'review_resumes',
  CONTACT_CANDIDATES = 'contact_candidates',
  SCORE_CANDIDATES = 'score_candidates',
  CREATE_INTERVIEWS = 'create_interviews',
  MANAGE_INTERVIEWS = 'manage_interviews',
  CHAT_WITH_CANDIDATES = 'chat_with_candidates',
  POST_JOBS_IF_ALLOWED = 'post_jobs_if_allowed',

  // Blog permissions - Content management
  MANAGE_BLOG_CATEGORIES = 'manage_blog_categories',
  APPROVE_BLOG_POSTS = 'approve_blog_posts',
  DELETE_ANY_BLOG_POST = 'delete_any_blog_post',
  WRITE_SYSTEM_BLOGS = 'write_system_blogs',
  WRITE_COMPANY_BLOGS = 'write_company_blogs',
  WRITE_RECRUITMENT_BLOGS = 'write_recruitment_blogs',
  WRITE_PERSONAL_BLOGS = 'write_personal_blogs',
  EDIT_OWN_BLOGS = 'edit_own_blogs',
  DELETE_OWN_BLOGS = 'delete_own_blogs',
  MANAGE_OWN_COMMENTS = 'manage_own_comments',
  MANAGE_COMPANY_BLOG_COMMENTS = 'manage_company_blog_comments',
  VIEW_BLOG_ANALYTICS = 'view_blog_analytics',
  REPORT_BLOG_CONTENT = 'report_blog_content',
  COMMENT_ON_BLOGS = 'comment_on_blogs',
  LIKE_BLOG_POSTS = 'like_blog_posts',
  SHARE_BLOG_POSTS = 'share_blog_posts',
  BOOKMARK_BLOGS = 'bookmark_blogs',

  // Job Seeker permissions - Job search and applications
  CREATE_PROFILE = 'create_profile',
  MANAGE_RESUME = 'manage_resume',
  UPLOAD_CV = 'upload_cv',
  CHOOSE_TEMPLATES = 'choose_templates',
  APPLY_TO_JOBS = 'apply_to_jobs',
  TRACK_APPLICATIONS = 'track_applications',
  RECEIVE_NOTIFICATIONS = 'receive_notifications',
  RECEIVE_FEEDBACK = 'receive_feedback',
  SAVE_JOBS = 'save_jobs',
}

export const RolePermissions = {
  [RoleName.ADMIN]: [
    // Full system access
    Permission.MANAGE_USERS,
    Permission.MANAGE_ROLES,
    Permission.MANAGE_COMPANIES,
    Permission.APPROVE_COMPANIES,
    Permission.MANAGE_JOBS,
    Permission.MODERATE_CONTENT,
    Permission.MANAGE_PACKAGES,
    Permission.MANAGE_PAYMENTS,
    Permission.VIEW_ANALYTICS,
    Permission.SYSTEM_CONFIG,
    Permission.SYSTEM_MONITORING,
    // Blog management - Full control
    Permission.MANAGE_BLOG_CATEGORIES,
    Permission.APPROVE_BLOG_POSTS,
    Permission.DELETE_ANY_BLOG_POST,
    Permission.WRITE_SYSTEM_BLOGS,
    Permission.VIEW_BLOG_ANALYTICS,
    // Can also do everything employers and HR can do
    Permission.CREATE_COMPANY_PROFILE,
    Permission.MANAGE_COMPANY_PROFILE,
    Permission.POST_JOBS,
    Permission.MANAGE_JOB_POSTINGS,
    Permission.VIEW_COMPANY_APPLICATIONS,
    Permission.MANAGE_COMPANY_HR,
    Permission.VIEW_RECRUITMENT_REPORTS,
    Permission.UPGRADE_PACKAGES,
  ],
  [RoleName.EMPLOYER]: [
    // Company management permissions
    Permission.CREATE_COMPANY_PROFILE,
    Permission.MANAGE_COMPANY_PROFILE,
    Permission.POST_JOBS,
    Permission.MANAGE_JOB_POSTINGS,
    Permission.VIEW_COMPANY_APPLICATIONS,
    Permission.MANAGE_COMPANY_HR,
    Permission.VIEW_RECRUITMENT_REPORTS,
    Permission.UPGRADE_PACKAGES,
    // Blog permissions - Company promotion
    Permission.WRITE_COMPANY_BLOGS,
    Permission.EDIT_OWN_BLOGS,
    Permission.DELETE_OWN_BLOGS,
    Permission.MANAGE_COMPANY_BLOG_COMMENTS,
    Permission.COMMENT_ON_BLOGS,
    Permission.LIKE_BLOG_POSTS,
    Permission.SHARE_BLOG_POSTS,
  ],
  [RoleName.HR]: [
    // HR recruitment permissions (within company)
    Permission.VIEW_COMPANY_JOBS,
    Permission.PROCESS_CANDIDATES,
    Permission.REVIEW_RESUMES,
    Permission.CONTACT_CANDIDATES,
    Permission.SCORE_CANDIDATES,
    Permission.CREATE_INTERVIEWS,
    Permission.MANAGE_INTERVIEWS,
    Permission.CHAT_WITH_CANDIDATES,
    Permission.POST_JOBS_IF_ALLOWED,
    // Blog permissions - Recruitment content
    Permission.WRITE_RECRUITMENT_BLOGS,
    Permission.EDIT_OWN_BLOGS,
    Permission.DELETE_OWN_BLOGS,
    Permission.MANAGE_OWN_COMMENTS,
    Permission.COMMENT_ON_BLOGS,
    Permission.LIKE_BLOG_POSTS,
    Permission.SHARE_BLOG_POSTS,
  ],
  [RoleName.JOB_SEEKER]: [
    // Job seeker permissions
    Permission.CREATE_PROFILE,
    Permission.MANAGE_RESUME,
    Permission.UPLOAD_CV,
    Permission.CHOOSE_TEMPLATES,
    Permission.APPLY_TO_JOBS,
    Permission.TRACK_APPLICATIONS,
    Permission.RECEIVE_NOTIFICATIONS,
    Permission.RECEIVE_FEEDBACK,
    Permission.SAVE_JOBS,
    // Blog permissions - Limited social features (depending on platform type)
    Permission.COMMENT_ON_BLOGS,
    Permission.LIKE_BLOG_POSTS,
    Permission.SHARE_BLOG_POSTS,
    Permission.BOOKMARK_BLOGS,
    Permission.REPORT_BLOG_CONTENT,
    // Optional: Personal blogging if platform supports it
    // Permission.WRITE_PERSONAL_BLOGS, // Uncomment if platform allows personal blogs
  ],
};

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ unique: true, type: 'varchar' })
  name: RoleName;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}

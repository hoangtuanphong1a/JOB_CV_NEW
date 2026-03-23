import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Company } from './company.entity';
import { User } from './user.entity';
import { SavedJob } from './saved-job.entity';
import { JobCategory } from './job-category.entity';
import { Skill } from './skill.entity';
import { JobTag } from './job-tag.entity';

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
}

export enum ExperienceLevel {
  ENTRY_LEVEL = 'entry_level', // 0-2 years
  JUNIOR = 'junior', // 2-4 years
  MID_LEVEL = 'mid_level', // 4-7 years
  SENIOR = 'senior', // 7-10 years
  LEAD = 'lead', // 10+ years
  EXECUTIVE = 'executive', // C-level
}

export enum JobStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
  EXPIRED = 'expired',
  PAUSED = 'paused',
}

export enum SalaryType {
  HOURLY = 'hourly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  NEGOTIABLE = 'negotiable',
}

@Entity('jobs')
export class Job extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  requirements?: string;

  @Column({ nullable: true })
  benefits?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  jobType?: JobType;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  experienceLevel?: ExperienceLevel;

  @Column({
    type: 'varchar',
    default: JobStatus.DRAFT,
  })
  status: JobStatus;

  // Salary information
  @Column({
    type: 'varchar',
    nullable: true,
  })
  salaryType?: SalaryType;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minSalary?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxSalary?: number;

  @Column({ nullable: true })
  currency?: string;

  // Location
  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  remoteWork?: boolean;

  // Skills and tags - Many-to-many relationships
  @ManyToMany(() => Skill, { cascade: true })
  @JoinTable({
    name: 'job_skills',
    joinColumn: { name: 'job_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skill_id', referencedColumnName: 'id' },
  })
  skills: Skill[];

  @ManyToMany(() => JobTag, { cascade: true })
  @JoinTable({
    name: 'job_job_tags',
    joinColumn: { name: 'job_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'job_tag_id', referencedColumnName: 'id' },
  })
  tags: JobTag[];

  // Dates
  @Column({ type: 'datetime', nullable: true })
  publishedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  expiresAt?: Date;

  // Foreign keys
  @Column({ name: 'company_id' })
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'posted_by_id' })
  postedById: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'posted_by_id' })
  postedBy: User;

  @Column({ name: 'category_id', nullable: true })
  categoryId?: string;

  @ManyToOne(() => JobCategory, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category?: JobCategory;

  // Analytics
  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'int', default: 0 })
  applicationCount: number;

  @OneToMany(() => SavedJob, (savedJob) => savedJob.job)
  savedJobs: SavedJob[];

  get salaryRange(): string {
    if (this.salaryType === SalaryType.NEGOTIABLE) {
      return 'Negotiable';
    }

    if (this.minSalary && this.maxSalary) {
      return `${this.currency || '$'}${this.minSalary.toLocaleString()} - ${this.currency || '$'}${this.maxSalary.toLocaleString()}`;
    }

    if (this.minSalary) {
      return `From ${this.currency || '$'}${this.minSalary.toLocaleString()}`;
    }

    if (this.maxSalary) {
      return `Up to ${this.currency || '$'}${this.maxSalary.toLocaleString()}`;
    }

    return 'Not specified';
  }

  get location(): string {
    const parts = [this.city, this.state, this.country].filter(Boolean);
    if (parts.length === 0) return 'Not specified';

    let location = parts.join(', ');
    if (this.remoteWork) {
      location += ' (Remote work available)';
    }

    return location;
  }

  get isActive(): boolean {
    return (
      this.status === JobStatus.PUBLISHED &&
      (!this.expiresAt || this.expiresAt > new Date())
    );
  }
}

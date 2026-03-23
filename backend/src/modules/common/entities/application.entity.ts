import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Job } from './job.entity';
import { JobSeekerProfile } from './job-seeker-profile.entity';

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  INTERVIEW = 'interview',
  REJECTED = 'rejected',
  HIRED = 'hired',
  WITHDRAWN = 'withdrawn',
}

export enum ApplicationSource {
  WEBSITE = 'website',
  EMAIL = 'email',
  LINKEDIN = 'linkedin',
  REFERRAL = 'referral',
  OTHER = 'other',
}

@Entity('applications')
export class Application extends BaseEntity {
  @Column({ nullable: true })
  coverLetter?: string; // Thư xin việc

  @Column({ nullable: true })
  resumeUrl?: string; // Link đến CV

  @Column({
    type: 'varchar',
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  source?: ApplicationSource;

  @Column({ nullable: true })
  notes?: string; // Ghi chú từ employer

  @Column({ type: 'datetime', nullable: true })
  reviewedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  interviewScheduledAt?: Date;

  @Column({ nullable: true })
  interviewNotes?: string;

  // Foreign keys
  @Column({ name: 'job_id' })
  jobId: string;

  @ManyToOne(() => Job, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Column({ name: 'job_seeker_profile_id' })
  jobSeekerProfileId: string;

  @ManyToOne(() => JobSeekerProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_seeker_profile_id' })
  jobSeekerProfile: JobSeekerProfile;

  @Column({ name: 'reviewed_by_id', nullable: true })
  reviewedById?: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reviewed_by_id' })
  reviewedBy?: User;

  // Analytics
  @Column({ type: 'int', default: 0 })
  viewCount: number; // Số lần employer xem application

  get applicantName(): string {
    return this.jobSeekerProfile?.fullName || 'Unknown';
  }

  get applicantEmail(): string {
    return this.jobSeekerProfile?.email || '';
  }

  get jobTitle(): string {
    return this.job?.title || 'Unknown Job';
  }

  get companyName(): string {
    return this.job?.company?.name || 'Unknown Company';
  }

  get daysSinceApplied(): number {
    const now = new Date();
    const applied = new Date(this.createdAt);
    const diffTime = Math.abs(now.getTime() - applied.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  get isActive(): boolean {
    return (
      this.status !== ApplicationStatus.WITHDRAWN &&
      this.status !== ApplicationStatus.REJECTED
    );
  }
}

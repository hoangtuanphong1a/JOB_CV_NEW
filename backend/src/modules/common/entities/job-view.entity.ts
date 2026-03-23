import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Job } from './job.entity';
import { User } from './user.entity';

@Entity('job_views')
export class JobView extends BaseEntity {
  @Column({ name: 'job_id' })
  jobId: string;

  @Column({ name: 'user_id', nullable: true })
  userId?: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  viewedAt: Date;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ nullable: true })
  sessionId?: string;

  // Relationships
  @ManyToOne(() => Job, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  // Helper methods
  get isAnonymous(): boolean {
    return !this.userId;
  }

  get viewerName(): string {
    return this.user?.fullName || 'Anonymous User';
  }

  get jobTitle(): string {
    return this.job?.title || 'Unknown Job';
  }
}

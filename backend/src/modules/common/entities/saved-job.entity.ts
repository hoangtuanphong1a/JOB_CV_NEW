import { Entity, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Job } from './job.entity';

@Entity('saved_jobs')
@Unique(['user', 'job'])
export class SavedJob extends BaseEntity {
  @ManyToOne(() => User, (user) => user.savedJobs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Job, (job) => job.savedJobs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job: Job;
}

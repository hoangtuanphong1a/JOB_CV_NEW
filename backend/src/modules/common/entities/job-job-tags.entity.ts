import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Job } from './job.entity';
import { JobTag } from './job-tag.entity';

@Entity('job_job_tags')
export class JobJobTags {
  @PrimaryColumn({ name: 'job_id' })
  jobId: string;

  @PrimaryColumn({ name: 'job_tag_id' })
  jobTagId: string;

  @ManyToOne(() => Job, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToOne(() => JobTag, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_tag_id' })
  jobTag: JobTag;
}

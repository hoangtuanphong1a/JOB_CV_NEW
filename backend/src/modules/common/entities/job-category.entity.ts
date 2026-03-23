import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Job } from './job.entity';

@Entity('job_categories')
export class JobCategory extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Job, (job) => job.category)
  jobs: Job[];
}

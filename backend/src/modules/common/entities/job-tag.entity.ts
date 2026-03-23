import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('job_tags')
export class JobTag extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;
}

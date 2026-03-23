import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Job } from './job.entity';
import { Skill } from './skill.entity';

@Entity('job_skills')
export class JobSkills {
  @PrimaryColumn({ name: 'job_id' })
  jobId: string;

  @PrimaryColumn({ name: 'skill_id' })
  skillId: string;

  @ManyToOne(() => Job, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToOne(() => Skill, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;
}

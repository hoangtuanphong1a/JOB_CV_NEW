import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { JobSeekerProfile } from './job-seeker-profile.entity';

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

@Entity('job_seeker_skills')
export class JobSeekerSkill extends BaseEntity {
  @Column()
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  level?: SkillLevel;

  @Column({ type: 'int', nullable: true })
  yearsOfExperience?: number;

  // Foreign key to job seeker profile
  @Column({ name: 'job_seeker_profile_id' })
  jobSeekerProfileId: string;

  @ManyToOne(() => JobSeekerProfile, (profile) => profile.skills, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'job_seeker_profile_id' })
  jobSeekerProfile: JobSeekerProfile;

  get levelText(): string {
    switch (this.level) {
      case SkillLevel.BEGINNER:
        return 'Beginner';
      case SkillLevel.INTERMEDIATE:
        return 'Intermediate';
      case SkillLevel.ADVANCED:
        return 'Advanced';
      case SkillLevel.EXPERT:
        return 'Expert';
      default:
        return 'Not specified';
    }
  }
}

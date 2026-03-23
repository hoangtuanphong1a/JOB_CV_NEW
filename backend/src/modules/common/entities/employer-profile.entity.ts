import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Company } from './company.entity';
import { Job } from './job.entity';

@Entity('employer_profiles')
export class EmployerProfile extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'company_id' })
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ nullable: true })
  title?: string; // Job title/role in company (e.g., HR Manager, CEO)

  @Column({ nullable: true })
  department?: string; // Department within company

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  linkedinUrl?: string;

  @Column({ nullable: true })
  websiteUrl?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string; // Short bio about the employer

  @Column({ default: false })
  isPrimaryContact: boolean; // Is this the primary contact for the company

  @Column({ default: true })
  isActive: boolean;

  // Relationships
  @OneToMany(() => Job, (job) => job.postedBy)
  postedJobs: Job[];
}

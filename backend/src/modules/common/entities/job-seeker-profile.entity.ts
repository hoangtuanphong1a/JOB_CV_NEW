import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { JobSeekerEducation } from './job-seeker-education.entity';
import { JobSeekerExperience } from './job-seeker-experience.entity';
import { JobSeekerSkill } from './job-seeker-skill.entity';

export enum EmploymentStatus {
  EMPLOYED = 'employed',
  UNEMPLOYED = 'unemployed',
  SELF_EMPLOYED = 'self_employed',
  STUDENT = 'student',
  FREELANCER = 'freelancer',
}

export enum SalaryExpectationType {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  HOURLY = 'hourly',
  NEGOTIABLE = 'negotiable',
}

@Entity('job_seeker_profiles')
export class JobSeekerProfile extends BaseEntity {
  @Column({ type: 'text', nullable: true })
  summary?: string; // Tóm tắt bản thân

  @Column({ nullable: true })
  currentTitle?: string; // Chức vụ hiện tại

  @Column({ type: 'int', nullable: true })
  yearsExperience?: number; // Số năm kinh nghiệm

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  postalCode?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  employmentStatus?: EmploymentStatus;

  // Mong muốn lương
  @Column({
    type: 'varchar',
    nullable: true,
  })
  salaryExpectationType?: SalaryExpectationType;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minSalaryExpectation?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxSalaryExpectation?: number;

  @Column({ nullable: true })
  salaryCurrency?: string;

  @Column({ type: 'text', nullable: true })
  careerGoals?: string; // Mục tiêu nghề nghiệp

  @Column({ type: 'text', nullable: true })
  achievements?: string; // Thành tựu nổi bật

  @Column({ type: 'int', default: 0 })
  profileViews: number; // Số lần hồ sơ được xem

  @Column({ type: 'int', default: 0 })
  profileCompletion: number; // % hoàn thiện hồ sơ (0-100)

  @Column({ type: 'datetime', nullable: true })
  lastUpdatedAt?: Date;

  // Foreign key to user
  @Column({ name: 'user_id', unique: true })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Relationships
  @OneToMany(
    () => JobSeekerEducation,
    (education) => education.jobSeekerProfile,
  )
  education: JobSeekerEducation[];

  @OneToMany(
    () => JobSeekerExperience,
    (experience) => experience.jobSeekerProfile,
  )
  experience: JobSeekerExperience[];

  @OneToMany(() => JobSeekerSkill, (skill) => skill.jobSeekerProfile)
  skills: JobSeekerSkill[];

  get salaryExpectation(): string {
    if (this.salaryExpectationType === SalaryExpectationType.NEGOTIABLE) {
      return 'Thỏa thuận';
    }

    if (this.minSalaryExpectation && this.maxSalaryExpectation) {
      return `${this.salaryCurrency || 'VND'}${this.minSalaryExpectation.toLocaleString()} - ${this.salaryCurrency || 'VND'}${this.maxSalaryExpectation.toLocaleString()}`;
    }

    if (this.minSalaryExpectation) {
      return `Từ ${this.salaryCurrency || 'VND'}${this.minSalaryExpectation.toLocaleString()}`;
    }

    if (this.maxSalaryExpectation) {
      return `Đến ${this.salaryCurrency || 'VND'}${this.maxSalaryExpectation.toLocaleString()}`;
    }

    return 'Chưa xác định';
  }

  get fullName(): string {
    return this.user?.fullName || 'Chưa cập nhật';
  }

  get email(): string {
    return this.user?.email || '';
  }

  get location(): string {
    const parts = [this.city, this.state, this.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Chưa cập nhật';
  }

  get isProfileComplete(): boolean {
    return this.profileCompletion >= 80;
  }
}

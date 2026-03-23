import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { JobSeekerProfile } from './job-seeker-profile.entity';

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
  APPRENTICESHIP = 'apprenticeship',
  VOLUNTEER = 'volunteer',
}

export enum ExperienceStatus {
  CURRENT = 'current',
  PREVIOUS = 'previous',
}

@Entity('job_seeker_experience')
export class JobSeekerExperience extends BaseEntity {
  @Column()
  company: string; // Tên công ty

  @Column()
  position: string; // Chức vụ

  @Column({
    type: 'varchar',
    nullable: true,
  })
  employmentType?: EmploymentType;

  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ type: 'text', nullable: true })
  description?: string; // Mô tả công việc

  @Column({ type: 'text', nullable: true })
  achievements?: string; // Thành tựu đạt được

  @Column({ nullable: true })
  industry?: string; // Ngành công nghiệp

  @Column({ nullable: true })
  companyWebsite?: string;

  @Column({
    type: 'varchar',
    default: ExperienceStatus.PREVIOUS,
  })
  status: ExperienceStatus;

  @Column({ type: 'int', nullable: true })
  orderIndex?: number; // Thứ tự hiển thị

  // Foreign key
  @Column({ name: 'job_seeker_profile_id' })
  jobSeekerProfileId: string;

  @ManyToOne(() => JobSeekerProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_seeker_profile_id' })
  jobSeekerProfile: JobSeekerProfile;

  get employmentTypeText(): string {
    switch (this.employmentType) {
      case EmploymentType.FULL_TIME:
        return 'Toàn thời gian';
      case EmploymentType.PART_TIME:
        return 'Bán thời gian';
      case EmploymentType.CONTRACT:
        return 'Hợp đồng';
      case EmploymentType.FREELANCE:
        return 'Freelance';
      case EmploymentType.INTERNSHIP:
        return 'Thực tập';
      case EmploymentType.APPRENTICESHIP:
        return 'Học việc';
      case EmploymentType.VOLUNTEER:
        return 'Tình nguyện';
      default:
        return 'Chưa xác định';
    }
  }

  get dateRange(): string {
    if (!this.startDate) return '';

    const start = this.startDate.getFullYear().toString();
    const end =
      this.status === ExperienceStatus.CURRENT
        ? 'Hiện tại'
        : this.endDate
          ? this.endDate.getFullYear().toString()
          : '';

    return end ? `${start} - ${end}` : start;
  }

  get location(): string {
    const parts = [this.city, this.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : '';
  }

  get isCurrent(): boolean {
    return this.status === ExperienceStatus.CURRENT;
  }

  get duration(): string {
    if (!this.startDate) return '';

    const start = this.startDate;
    const end =
      this.status === ExperienceStatus.CURRENT ? new Date() : this.endDate;

    if (!end) return '';

    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();

    if (years > 0) {
      return `${years} năm${months > 0 ? ` ${months} tháng` : ''}`;
    }

    return `${months} tháng`;
  }
}

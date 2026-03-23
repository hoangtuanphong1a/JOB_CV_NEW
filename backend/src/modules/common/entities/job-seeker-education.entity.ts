import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { JobSeekerProfile } from './job-seeker-profile.entity';

export enum DegreeType {
  HIGH_SCHOOL = 'high_school',
  ASSOCIATE = 'associate',
  BACHELOR = 'bachelor',
  MASTER = 'master',
  DOCTORATE = 'doctorate',
  CERTIFICATE = 'certificate',
  DIPLOMA = 'diploma',
  OTHER = 'other',
}

export enum EducationStatus {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress',
  INCOMPLETE = 'incomplete',
}

@Entity('job_seeker_education')
export class JobSeekerEducation extends BaseEntity {
  @Column()
  institution: string; // Trường học

  @Column({ nullable: true })
  degree?: string; // Bằng cấp (ví dụ: "Bachelor of Computer Science")

  @Column({
    type: 'varchar',
    nullable: true,
  })
  degreeType?: DegreeType;

  @Column({ nullable: true })
  fieldOfStudy?: string; // Ngành học

  @Column({ nullable: true })
  gpa?: string; // Điểm trung bình

  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ type: 'text', nullable: true })
  description?: string; // Mô tả về học vấn này

  @Column({ type: 'text', nullable: true })
  achievements?: string; // Thành tựu trong thời gian học

  @Column({
    type: 'varchar',
    default: EducationStatus.COMPLETED,
  })
  status: EducationStatus;

  @Column({ type: 'int', nullable: true })
  orderIndex?: number; // Thứ tự hiển thị

  // Foreign key
  @Column({ name: 'job_seeker_profile_id' })
  jobSeekerProfileId: string;

  @ManyToOne(() => JobSeekerProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_seeker_profile_id' })
  jobSeekerProfile: JobSeekerProfile;

  get degreeText(): string {
    switch (this.degreeType) {
      case DegreeType.HIGH_SCHOOL:
        return 'Trung học phổ thông';
      case DegreeType.ASSOCIATE:
        return 'Cao đẳng';
      case DegreeType.BACHELOR:
        return 'Cử nhân';
      case DegreeType.MASTER:
        return 'Thạc sĩ';
      case DegreeType.DOCTORATE:
        return 'Tiến sĩ';
      case DegreeType.CERTIFICATE:
        return 'Chứng chỉ';
      case DegreeType.DIPLOMA:
        return 'Bằng';
      default:
        return this.degree || 'Chưa xác định';
    }
  }

  get dateRange(): string {
    if (!this.startDate) return '';

    const start = this.startDate.getFullYear().toString();
    const end =
      this.status === EducationStatus.IN_PROGRESS
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

  get isCompleted(): boolean {
    return this.status === EducationStatus.COMPLETED;
  }

  get duration(): string {
    if (!this.startDate || !this.endDate) return '';

    const start = this.startDate;
    const end =
      this.status === EducationStatus.IN_PROGRESS ? new Date() : this.endDate;

    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();

    if (years > 0) {
      return `${years} năm${months > 0 ? ` ${months} tháng` : ''}`;
    }

    return `${months} tháng`;
  }
}

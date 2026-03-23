import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { JobSeekerProfile } from './job-seeker-profile.entity';
import { CvTemplate } from './cv-template.entity';

export enum CVStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum CVVisibility {
  PRIVATE = 'private', // Chỉ mình tôi xem được
  PUBLIC = 'public', // Ai cũng có thể xem qua link
  EMPLOYERS = 'employers', // Chỉ employer có thể xem
}

@Entity('cvs')
export class CV extends BaseEntity {
  @Column()
  title: string; // Tên CV (VD: "Frontend Developer CV")

  @Column({ type: 'text', nullable: true })
  content?: string; // Nội dung JSON của CV

  @Column({ nullable: true })
  templateId?: string; // ID của template được sử dụng

  @ManyToOne(() => CvTemplate, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'templateId' })
  template?: CvTemplate;

  @Column({
    type: 'varchar',
    default: CVStatus.DRAFT,
  })
  status: CVStatus;

  @Column({
    type: 'varchar',
    default: CVVisibility.PRIVATE,
  })
  visibility: CVVisibility;

  @Column({ type: 'boolean', default: false })
  isPrimary: boolean; // CV chính được sử dụng mặc định khi apply

  @Column({ nullable: true })
  publicUrl?: string; // URL công khai để chia sẻ CV

  @Column({ nullable: true })
  pdfUrl?: string; // URL file PDF đã tạo

  @Column({ type: 'int', default: 0 })
  viewCount: number; // Số lần CV được xem

  @Column({ type: 'int', default: 0 })
  downloadCount: number; // Số lần CV được tải xuống

  @Column({ nullable: true })
  thumbnailUrl?: string; // URL ảnh thumbnail của CV

  @Column({ type: 'datetime', nullable: true })
  lastModifiedAt?: Date;

  // Foreign key to job seeker profile
  @Column({ name: 'job_seeker_profile_id' })
  jobSeekerProfileId: string;

  @ManyToOne(() => JobSeekerProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_seeker_profile_id' })
  jobSeekerProfile: JobSeekerProfile;

  get isPublished(): boolean {
    return this.status === CVStatus.PUBLISHED;
  }

  get isPublic(): boolean {
    return this.visibility === CVVisibility.PUBLIC;
  }

  get canBeViewedByEmployer(): boolean {
    return (
      this.visibility === CVVisibility.PUBLIC ||
      this.visibility === CVVisibility.EMPLOYERS
    );
  }
}

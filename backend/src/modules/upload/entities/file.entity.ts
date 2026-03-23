import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../common/entities/user.entity';

export enum FileType {
  AVATAR = 'avatar',
  COMPANY_LOGO = 'company_logo',
  COMPANY_BANNER = 'company_banner',
  CV_DOCUMENT = 'cv_document',
  BLOG_IMAGE = 'blog_image',
  OTHER = 'other',
}

@Entity('files')
export class File extends BaseEntity {
  @Column()
  originalName: string;

  @Column()
  filename: string;

  @Column()
  mimeType: string;

  @Column('bigint')
  size: number;

  @Column({
    type: 'enum',
    enum: FileType,
    default: FileType.OTHER,
  })
  fileType: FileType;

  @Column()
  path: string;

  @Column({ nullable: true })
  url: string;

  @Column({ name: 'uploaded_by_id' })
  uploadedById: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'uploaded_by_id' })
  uploadedBy: User;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ nullable: true })
  altText?: string;

  @Column({ nullable: true })
  description?: string;
}

import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { CV } from './cv.entity';

@Entity('cv_templates')
export class CvTemplate extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'json', nullable: true })
  layoutMeta?: object; // JSON: colors, sections, layout config

  @Column({ default: true })
  isPublic: boolean;

  @Column({ name: 'created_by', nullable: true })
  createdById?: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy?: User;

  @OneToMany(() => CV, (cv) => cv.template)
  cvs: CV[];
}

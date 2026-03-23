import { Entity, Column, OneToMany, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { BaseEntity } from './base.entity';
import { UserRole } from './user-role.entity';
import { SavedJob } from './saved-job.entity';
import { JobSeekerProfile } from './job-seeker-profile.entity';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  gender?: Gender;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  avatar?: string;

  @Column({
    type: 'varchar',
    default: 'active',
  })
  status: string;

  @Column({ type: 'datetime', nullable: true })
  emailVerifiedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  lastLoginAt?: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ nullable: true })
  statusReason?: string;

  // Social login fields
  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  linkedInId?: string;

  @Column({ type: 'text', nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true })
  preferredLocale?: string;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @OneToMany(() => SavedJob, (savedJob) => savedJob.user)
  savedJobs: SavedJob[];

  @OneToMany(
    () => JobSeekerProfile,
    (jobSeekerProfile) => jobSeekerProfile.user,
  )
  jobSeekerProfiles: JobSeekerProfile[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const saltRounds = 12;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  get fullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }
}

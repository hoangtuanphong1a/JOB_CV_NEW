import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

export enum CompanySize {
  STARTUP = 'startup', // 1-10 employees
  SMALL = 'small', // 11-50 employees
  MEDIUM = 'medium', // 51-200 employees
  LARGE = 'large', // 201-1000 employees
  ENTERPRISE = 'enterprise', // 1000+ employees
}

export enum Industry {
  TECHNOLOGY = 'technology',
  HEALTHCARE = 'healthcare',
  FINANCE = 'finance',
  EDUCATION = 'education',
  RETAIL = 'retail',
  MANUFACTURING = 'manufacturing',
  CONSULTING = 'consulting',
  REAL_ESTATE = 'real_estate',
  HOSPITALITY = 'hospitality',
  OTHER = 'other',
}

@Entity('companies')
export class Company extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ nullable: true })
  banner?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  industry?: Industry;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  size?: CompanySize;

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

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({
    type: 'varchar',
    default: 'active',
  })
  status: string;

  // Verification fields for admin approval
  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'datetime', nullable: true })
  verifiedAt?: Date;

  @Column({ type: 'text', nullable: true })
  adminNotes?: string;

  // Foreign key to the user who created/owns the company
  @Column({ name: 'owner_id' })
  ownerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  get fullAddress(): string {
    const parts = [this.address, this.city, this.state, this.country].filter(
      Boolean,
    );
    return parts.join(', ');
  }
}

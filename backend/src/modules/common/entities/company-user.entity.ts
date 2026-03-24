import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './company.entity';
import { User } from './user.entity';

export enum CompanyUserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  HR = 'hr',
  MANAGER = 'manager',
  VIEWER = 'viewer',
}

@Entity('company_users')
export class CompanyUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company!: Company;

  @Column()
  companyId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: string;

  @Column({
    type: 'varchar',
    default: CompanyUserRole.HR,
  })
  role!: CompanyUserRole;

  @Column({ type: 'simple-array', nullable: true })
  permissions?: string[];

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'datetime', nullable: true })
  invitedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  acceptedAt?: Date;

  @Column({ nullable: true })
  invitedBy?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
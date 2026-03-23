import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../common/entities/user.entity';
import { Company } from '../common/entities/company.entity';

@Entity('hr_company_relationships')
@Unique(['hrUserId', 'companyId'])
export class HRCompanyRelationship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  hrUserId: string;

  @Column('uuid')
  companyId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  hrRole: string; // e.g., 'HR Manager', 'Recruiter', 'HR Specialist'

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  permissions: object; // JSON object with specific permissions

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hrUserId' })
  hrUser: User;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

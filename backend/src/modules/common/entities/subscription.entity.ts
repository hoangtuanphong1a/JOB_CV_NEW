import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Company } from './company.entity';
import { SubscriptionPlan } from './subscription-plan.entity';
import { Payment } from './payment.entity';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PENDING = 'pending',
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

@Entity('subscriptions')
export class Subscription extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'company_id' })
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'plan_id' })
  planId: string;

  @ManyToOne(() => SubscriptionPlan, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plan_id' })
  plan: SubscriptionPlan;

  @Column({
    type: 'varchar',
    default: SubscriptionStatus.PENDING,
  })
  status: SubscriptionStatus;

  @Column({
    type: 'varchar',
    default: BillingCycle.MONTHLY,
  })
  billingCycle: BillingCycle;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({ type: 'datetime', nullable: true })
  cancelledAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  nextBillingDate?: Date;

  @Column({ type: 'boolean', default: true })
  autoRenew: boolean;

  @Column({ type: 'int', default: 0 })
  jobsPosted: number;

  @Column({ type: 'int', default: 0 })
  applicationsViewed: number;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @OneToMany(() => Payment, (payment) => payment.subscription)
  payments: Payment[];

  get isActive(): boolean {
    return (
      this.status === SubscriptionStatus.ACTIVE &&
      new Date() >= this.startDate &&
      new Date() <= this.endDate
    );
  }

  get isExpired(): boolean {
    return new Date() > this.endDate;
  }

  get daysUntilExpiry(): number {
    const now = new Date();
    const diffTime = this.endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get canPostMoreJobs(): boolean {
    return this.plan.canPostJobs(this.jobsPosted);
  }

  get canViewMoreApplications(): boolean {
    return this.plan.canViewApplications(this.applicationsViewed);
  }

  incrementJobsPosted(): void {
    this.jobsPosted += 1;
  }

  incrementApplicationsViewed(): void {
    this.applicationsViewed += 1;
  }

  renew(): void {
    const now = new Date();
    let newEndDate: Date;

    if (this.billingCycle === BillingCycle.MONTHLY) {
      newEndDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
      );
    } else {
      newEndDate = new Date(
        now.getFullYear() + 1,
        now.getMonth(),
        now.getDate(),
      );
    }

    this.endDate = newEndDate;
    this.nextBillingDate = newEndDate;
    this.status = SubscriptionStatus.ACTIVE;
  }

  cancel(): void {
    this.status = SubscriptionStatus.CANCELLED;
    this.cancelledAt = new Date();
    this.autoRenew = false;
  }
}

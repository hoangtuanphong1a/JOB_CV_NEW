import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Subscription } from './subscription.entity';

export enum PlanType {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

@Entity('subscription_plans')
export class SubscriptionPlan extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'varchar',
    default: PlanType.FREE,
  })
  planType: PlanType;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({
    type: 'varchar',
    default: BillingCycle.MONTHLY,
  })
  billingCycle: BillingCycle;

  @Column({ type: 'int', default: 1 })
  maxJobs: number; // Maximum jobs that can be posted

  @Column({ type: 'int', default: 5 })
  maxApplications: number; // Maximum applications that can be viewed per job

  @Column({ type: 'boolean', default: false })
  featured: boolean; // Featured in listings

  @Column({ type: 'boolean', default: false })
  prioritySupport: boolean;

  @Column({ type: 'boolean', default: false })
  analyticsAccess: boolean;

  @Column({ type: 'json', nullable: true })
  features?: string[]; // Additional features

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', nullable: true })
  sortOrder?: number;

  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[];

  get displayPrice(): string {
    if (this.price === 0) {
      return 'Free';
    }

    const currency = '$';
    const cycle =
      this.billingCycle === BillingCycle.YEARLY ? '/year' : '/month';
    return `${currency}${this.price}${cycle}`;
  }

  get yearlyPrice(): number {
    if (this.billingCycle === BillingCycle.YEARLY) {
      return this.price;
    }
    return this.price * 12;
  }

  get monthlyPrice(): number {
    if (this.billingCycle === BillingCycle.MONTHLY) {
      return this.price;
    }
    return this.price / 12;
  }

  canPostJobs(currentJobs: number): boolean {
    if (this.planType === PlanType.FREE) {
      return currentJobs < this.maxJobs;
    }
    return true; // Paid plans have higher limits or unlimited
  }

  canViewApplications(currentViews: number): boolean {
    if (this.planType === PlanType.FREE) {
      return currentViews < this.maxApplications;
    }
    return true; // Paid plans have higher limits or unlimited
  }
}

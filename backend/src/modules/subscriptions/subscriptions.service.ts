import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Subscription,
  SubscriptionStatus,
  BillingCycle,
} from '../common/entities/subscription.entity';
import {
  SubscriptionPlan,
  PlanType,
} from '../common/entities/subscription-plan.entity';
import { User } from '../common/entities/user.entity';
import { Company } from '../common/entities/company.entity';
import { Payment } from '../common/entities/payment.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(SubscriptionPlan)
    private subscriptionPlanRepository: Repository<SubscriptionPlan>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async createSubscription(
    userId: string,
    companyId: string,
    planId: string,
    billingCycle: BillingCycle = BillingCycle.MONTHLY,
  ): Promise<Subscription> {
    // Verify user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify company exists and user owns it
    const company = await this.companyRepository.findOne({
      where: { id: companyId, ownerId: userId },
    });
    if (!company) {
      throw new NotFoundException('Company not found or access denied');
    }

    // Verify plan exists and is active
    const plan = await this.subscriptionPlanRepository.findOne({
      where: { id: planId, isActive: true },
    });
    if (!plan) {
      throw new NotFoundException('Subscription plan not found or inactive');
    }

    // Check if company already has an active subscription
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: {
        companyId,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    if (existingSubscription) {
      throw new BadRequestException(
        'Company already has an active subscription',
      );
    }

    // Calculate subscription dates
    const startDate = new Date();
    let endDate: Date;
    let price: number;

    if (billingCycle === BillingCycle.MONTHLY) {
      endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate(),
      );
      price = plan.monthlyPrice;
    } else {
      endDate = new Date(
        startDate.getFullYear() + 1,
        startDate.getMonth(),
        startDate.getDate(),
      );
      price = plan.yearlyPrice;
    }

    // Create subscription
    const subscription = this.subscriptionRepository.create({
      userId,
      user,
      companyId,
      company,
      planId,
      plan,
      status:
        plan.planType === PlanType.FREE
          ? SubscriptionStatus.ACTIVE
          : SubscriptionStatus.PENDING,
      billingCycle,
      price,
      startDate,
      endDate,
      nextBillingDate: endDate,
      autoRenew: true,
      jobsPosted: 0,
      applicationsViewed: 0,
    });

    return this.subscriptionRepository.save(subscription);
  }

  async getActiveSubscriptionForCompany(
    companyId: string,
  ): Promise<Subscription | null> {
    return this.subscriptionRepository.findOne({
      where: {
        companyId,
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['plan', 'user', 'company'],
    });
  }

  async getActiveSubscriptionForUser(
    userId: string,
  ): Promise<Subscription | null> {
    return this.subscriptionRepository.findOne({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['plan', 'user', 'company'],
    });
  }

  async canPostJob(companyId: string): Promise<{
    canPost: boolean;
    reason?: string;
    subscription?: Subscription;
  }> {
    const subscription = await this.getActiveSubscriptionForCompany(companyId);

    if (!subscription) {
      // Check if there's a free plan available
      const freePlan = await this.subscriptionPlanRepository.findOne({
        where: { planType: PlanType.FREE, isActive: true },
      });

      if (!freePlan) {
        return {
          canPost: false,
          reason: 'No active subscription and no free plan available',
        };
      }

      // Create free subscription automatically
      const company = await this.companyRepository.findOne({
        where: { id: companyId },
      });
      if (!company) {
        return { canPost: false, reason: 'Company not found' };
      }

      const freeSubscription = await this.createFreeSubscription(
        company.ownerId,
        companyId,
      );
      return {
        canPost: freeSubscription.canPostMoreJobs,
        subscription: freeSubscription,
        reason: freeSubscription.canPostMoreJobs
          ? undefined
          : 'Job posting limit reached',
      };
    }

    return {
      canPost: subscription.canPostMoreJobs,
      subscription,
      reason: subscription.canPostMoreJobs
        ? undefined
        : 'Job posting limit reached',
    };
  }

  async canViewApplication(companyId: string): Promise<{
    canView: boolean;
    reason?: string;
    subscription?: Subscription;
  }> {
    const subscription = await this.getActiveSubscriptionForCompany(companyId);

    if (!subscription) {
      return { canView: false, reason: 'No active subscription' };
    }

    return {
      canView: subscription.canViewMoreApplications,
      subscription,
      reason: subscription.canViewMoreApplications
        ? undefined
        : 'Application viewing limit reached',
    };
  }

  async incrementJobsPosted(companyId: string): Promise<void> {
    const subscription = await this.getActiveSubscriptionForCompany(companyId);

    if (subscription) {
      subscription.incrementJobsPosted();
      await this.subscriptionRepository.save(subscription);
    }
  }

  async incrementApplicationsViewed(companyId: string): Promise<void> {
    const subscription = await this.getActiveSubscriptionForCompany(companyId);

    if (subscription) {
      subscription.incrementApplicationsViewed();
      await this.subscriptionRepository.save(subscription);
    }
  }

  async getSubscriptionById(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['plan', 'user', 'company', 'payments'],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return subscription;
  }

  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      where: { userId },
      relations: ['plan', 'company'],
      order: { createdAt: 'DESC' },
    });
  }

  async cancelSubscription(id: string, userId: string): Promise<Subscription> {
    const subscription = await this.getSubscriptionById(id);

    if (subscription.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new BadRequestException('Can only cancel active subscriptions');
    }

    subscription.cancel();
    return this.subscriptionRepository.save(subscription);
  }

  async renewSubscription(id: string): Promise<Subscription> {
    const subscription = await this.getSubscriptionById(id);

    if (!subscription.autoRenew) {
      throw new BadRequestException(
        'Auto-renewal is disabled for this subscription',
      );
    }

    subscription.renew();
    return this.subscriptionRepository.save(subscription);
  }

  async createFreeSubscription(
    userId: string,
    companyId: string,
  ): Promise<Subscription> {
    const freePlan = await this.subscriptionPlanRepository.findOne({
      where: { planType: PlanType.FREE, isActive: true },
    });

    if (!freePlan) {
      throw new BadRequestException('Free plan not available');
    }

    return this.createSubscription(
      userId,
      companyId,
      freePlan.id,
      BillingCycle.MONTHLY,
    );
  }

  async upgradeSubscription(
    subscriptionId: string,
    newPlanId: string,
    billingCycle: BillingCycle = BillingCycle.MONTHLY,
    userId: string,
  ): Promise<Subscription> {
    const subscription = await this.getSubscriptionById(subscriptionId);

    if (subscription.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Verify new plan exists
    const newPlan = await this.subscriptionPlanRepository.findOne({
      where: { id: newPlanId, isActive: true },
    });
    if (!newPlan) {
      throw new NotFoundException('New subscription plan not found');
    }

    // Cancel current subscription
    subscription.cancel();
    await this.subscriptionRepository.save(subscription);

    // Create new subscription
    return this.createSubscription(
      subscription.userId,
      subscription.companyId,
      newPlanId,
      billingCycle,
    );
  }

  async getSubscriptionStats(): Promise<{
    totalSubscriptions: number;
    activeSubscriptions: number;
    subscriptionsByStatus: Record<string, number>;
    subscriptionsByPlan: Record<string, number>;
    monthlyRevenue: number;
    yearlyRevenue: number;
  }> {
    const subscriptions = await this.subscriptionRepository.find({
      relations: ['plan'],
    });

    const totalSubscriptions = subscriptions.length;
    const activeSubscriptions = subscriptions.filter(
      (s) => s.status === SubscriptionStatus.ACTIVE,
    ).length;

    // Count by status
    const subscriptionsByStatus: Record<string, number> = {};
    subscriptions.forEach((sub) => {
      subscriptionsByStatus[sub.status] =
        (subscriptionsByStatus[sub.status] || 0) + 1;
    });

    // Count by plan
    const subscriptionsByPlan: Record<string, number> = {};
    subscriptions.forEach((sub) => {
      const planName = sub.plan.name;
      subscriptionsByPlan[planName] = (subscriptionsByPlan[planName] || 0) + 1;
    });

    // Calculate revenue (simplified - would need payment records in real implementation)
    const monthlyRevenue = subscriptions
      .filter(
        (s) =>
          s.status === SubscriptionStatus.ACTIVE &&
          s.billingCycle === BillingCycle.MONTHLY,
      )
      .reduce((sum, s) => sum + Number(s.price), 0);

    const yearlyRevenue = subscriptions
      .filter(
        (s) =>
          s.status === SubscriptionStatus.ACTIVE &&
          s.billingCycle === BillingCycle.YEARLY,
      )
      .reduce((sum, s) => sum + Number(s.price), 0);

    return {
      totalSubscriptions,
      activeSubscriptions,
      subscriptionsByStatus,
      subscriptionsByPlan,
      monthlyRevenue,
      yearlyRevenue,
    };
  }
}

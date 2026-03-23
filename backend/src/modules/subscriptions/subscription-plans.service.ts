import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SubscriptionPlan,
  PlanType,
} from '../common/entities/subscription-plan.entity';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';

@Injectable()
export class SubscriptionPlansService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private subscriptionPlanRepository: Repository<SubscriptionPlan>,
  ) {}

  async create(
    createSubscriptionPlanDto: CreateSubscriptionPlanDto,
  ): Promise<SubscriptionPlan> {
    // Check if plan with same name already exists
    const existingPlan = await this.subscriptionPlanRepository.findOne({
      where: { name: createSubscriptionPlanDto.name },
    });

    if (existingPlan) {
      throw new ConflictException(
        'Subscription plan with this name already exists',
      );
    }

    const plan = this.subscriptionPlanRepository.create(
      createSubscriptionPlanDto,
    );
    return this.subscriptionPlanRepository.save(plan);
  }

  async findAll(query: any = {}): Promise<{
    data: SubscriptionPlan[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      planType,
      isActive = true,
      sortBy = 'sortOrder',
      sortOrder = 'ASC',
    } = query;

    const skip = (page - 1) * limit;
    const where: any = {};

    // Add filters
    if (search) {
      where.name = `%${search}%`;
    }
    if (planType) {
      where.planType = planType;
    }
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [plans, total] = await this.subscriptionPlanRepository.findAndCount({
      where,
      relations: ['subscriptions'],
      skip,
      take: limit,
      order: { [sortBy]: sortOrder },
    });

    return {
      data: plans,
      total,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<SubscriptionPlan> {
    const plan = await this.subscriptionPlanRepository.findOne({
      where: { id },
      relations: ['subscriptions'],
    });

    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }

    return plan;
  }

  async findByType(planType: PlanType): Promise<SubscriptionPlan[]> {
    return this.subscriptionPlanRepository.find({
      where: { planType, isActive: true },
      relations: ['subscriptions'],
      order: { sortOrder: 'ASC', price: 'ASC' },
    });
  }

  async findActivePlans(): Promise<SubscriptionPlan[]> {
    return this.subscriptionPlanRepository.find({
      where: { isActive: true },
      relations: ['subscriptions'],
      order: { sortOrder: 'ASC', price: 'ASC' },
    });
  }

  async update(
    id: string,
    updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
  ): Promise<SubscriptionPlan> {
    const plan = await this.findOne(id);

    // Check if name is being changed and if it conflicts
    if (
      updateSubscriptionPlanDto.name &&
      updateSubscriptionPlanDto.name !== plan.name
    ) {
      const existingPlan = await this.subscriptionPlanRepository.findOne({
        where: { name: updateSubscriptionPlanDto.name },
      });

      if (existingPlan) {
        throw new ConflictException(
          'Subscription plan with this name already exists',
        );
      }
    }

    await this.subscriptionPlanRepository.update(id, updateSubscriptionPlanDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const plan = await this.findOne(id);

    // Check if plan has active subscriptions
    const hasActiveSubscriptions = plan.subscriptions.some(
      (subscription) =>
        subscription.status === 'active' || subscription.status === 'pending',
    );

    if (hasActiveSubscriptions) {
      throw new ConflictException(
        'Cannot delete plan with active subscriptions',
      );
    }

    await this.subscriptionPlanRepository.remove(plan);
  }

  async activatePlan(id: string): Promise<SubscriptionPlan> {
    await this.subscriptionPlanRepository.update(id, { isActive: true });
    return this.findOne(id);
  }

  async deactivatePlan(id: string): Promise<SubscriptionPlan> {
    await this.subscriptionPlanRepository.update(id, { isActive: false });
    return this.findOne(id);
  }

  async getPopularPlans(): Promise<SubscriptionPlan[]> {
    // Get plans sorted by subscription count (would need more complex query in real implementation)
    const plans = await this.subscriptionPlanRepository.find({
      where: { isActive: true },
      relations: ['subscriptions'],
      order: { sortOrder: 'ASC' },
    });

    // Sort by subscription count (descending)
    return plans.sort(
      (a, b) => b.subscriptions.length - a.subscriptions.length,
    );
  }

  async getPlanStats(): Promise<{
    totalPlans: number;
    activePlans: number;
    plansByType: Record<string, number>;
  }> {
    const [totalPlans, activePlans] = await Promise.all([
      this.subscriptionPlanRepository.count(),
      this.subscriptionPlanRepository.count({ where: { isActive: true } }),
    ]);

    // Count plans by type
    const plansByType = await this.subscriptionPlanRepository
      .createQueryBuilder('plan')
      .select('plan.planType', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('plan.isActive = :isActive', { isActive: true })
      .groupBy('plan.planType')
      .getRawMany();

    const plansByTypeRecord: Record<string, number> = {};
    plansByType.forEach((item) => {
      plansByTypeRecord[item.type] = parseInt(item.count);
    });

    return {
      totalPlans,
      activePlans,
      plansByType: plansByTypeRecord,
    };
  }

  async reorderPlans(planIds: string[]): Promise<void> {
    const updatePromises = planIds.map((planId, index) =>
      this.subscriptionPlanRepository.update(planId, { sortOrder: index + 1 }),
    );

    await Promise.all(updatePromises);
  }

  async getFreePlan(): Promise<SubscriptionPlan | null> {
    return this.subscriptionPlanRepository.findOne({
      where: { planType: PlanType.FREE, isActive: true },
    });
  }

  async getBasicPlan(): Promise<SubscriptionPlan | null> {
    return this.subscriptionPlanRepository.findOne({
      where: { planType: PlanType.BASIC, isActive: true },
    });
  }

  async getPremiumPlan(): Promise<SubscriptionPlan | null> {
    return this.subscriptionPlanRepository.findOne({
      where: { planType: PlanType.PREMIUM, isActive: true },
    });
  }

  async getEnterprisePlan(): Promise<SubscriptionPlan | null> {
    return this.subscriptionPlanRepository.findOne({
      where: { planType: PlanType.ENTERPRISE, isActive: true },
    });
  }
}

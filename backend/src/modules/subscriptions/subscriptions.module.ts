import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlansController } from './subscription-plans.controller';
import { SubscriptionPlansService } from './subscription-plans.service';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionPlan } from '../common/entities/subscription-plan.entity';
import { Subscription } from '../common/entities/subscription.entity';
import { Payment } from '../common/entities/payment.entity';
import { User } from '../common/entities/user.entity';
import { Company } from '../common/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubscriptionPlan,
      Subscription,
      Payment,
      User,
      Company,
    ]),
  ],
  controllers: [SubscriptionPlansController],
  providers: [SubscriptionPlansService, SubscriptionsService],
  exports: [SubscriptionPlansService, SubscriptionsService],
})
export class SubscriptionsModule {}

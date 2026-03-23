import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  PlanType,
  BillingCycle,
} from '../../common/entities/subscription-plan.entity';

export class CreateSubscriptionPlanDto {
  @ApiProperty({
    description: 'Plan name',
    example: 'Premium Plan',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Plan description',
    example: 'Full access to all features',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Plan type',
    enum: PlanType,
    example: PlanType.PREMIUM,
  })
  @IsEnum(PlanType)
  @IsOptional()
  planType?: PlanType;

  @ApiPropertyOptional({
    description: 'Plan price',
    example: 29.99,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    description: 'Billing cycle',
    enum: BillingCycle,
    example: BillingCycle.MONTHLY,
  })
  @IsEnum(BillingCycle)
  @IsOptional()
  billingCycle?: BillingCycle;

  @ApiPropertyOptional({
    description: 'Maximum jobs that can be posted',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  maxJobs?: number;

  @ApiPropertyOptional({
    description: 'Maximum applications that can be viewed per job',
    example: 50,
  })
  @IsNumber()
  @IsOptional()
  maxApplications?: number;

  @ApiPropertyOptional({
    description: 'Featured in listings',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @ApiPropertyOptional({
    description: 'Priority support',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  prioritySupport?: boolean;

  @ApiPropertyOptional({
    description: 'Analytics access',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  analyticsAccess?: boolean;

  @ApiPropertyOptional({
    description: 'Additional features',
    example: ['Advanced analytics', 'Priority support', 'Custom branding'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @ApiPropertyOptional({
    description: 'Plan is active',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Sort order for display',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}

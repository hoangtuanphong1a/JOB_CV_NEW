import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsArray,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  JobType,
  ExperienceLevel,
  SalaryType,
} from '../../common/entities/job.entity';
import { Type } from 'class-transformer';

export class CreateJobDto {
  @ApiProperty({
    description: 'Job title',
    example: 'Senior Software Engineer',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Job description',
    example: 'We are looking for a senior software engineer...',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Job requirements',
    example: '5+ years of experience, React, Node.js, etc.',
  })
  @IsString()
  @IsOptional()
  requirements?: string;

  @ApiPropertyOptional({
    description: 'Job benefits',
    example: 'Health insurance, flexible hours, etc.',
  })
  @IsString()
  @IsOptional()
  benefits?: string;

  @ApiPropertyOptional({
    description: 'Job type',
    enum: JobType,
    example: JobType.FULL_TIME,
  })
  @IsEnum(JobType)
  @IsOptional()
  jobType?: JobType;

  @ApiPropertyOptional({
    description: 'Experience level required',
    enum: ExperienceLevel,
    example: ExperienceLevel.SENIOR,
  })
  @IsEnum(ExperienceLevel)
  @IsOptional()
  experienceLevel?: ExperienceLevel;

  @ApiPropertyOptional({
    description: 'Salary type',
    enum: SalaryType,
    example: SalaryType.YEARLY,
  })
  @IsEnum(SalaryType)
  @IsOptional()
  salaryType?: SalaryType;

  @ApiPropertyOptional({
    description: 'Minimum salary',
    example: 50000,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minSalary?: number;

  @ApiPropertyOptional({
    description: 'Maximum salary',
    example: 80000,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxSalary?: number;

  @ApiPropertyOptional({
    description: 'Salary currency',
    example: 'USD',
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({
    description: 'Job location - city',
    example: 'San Francisco',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({
    description: 'Job location - state/province',
    example: 'California',
  })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({
    description: 'Job location - country',
    example: 'United States',
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({
    description: 'Remote work available',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  remoteWork?: boolean;

  @ApiPropertyOptional({
    description: 'Required skill IDs',
    example: ['uuid-skill-1', 'uuid-skill-2', 'uuid-skill-3'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skillIds?: string[];

  @ApiPropertyOptional({
    description: 'Job tag IDs',
    example: ['uuid-tag-1', 'uuid-tag-2', 'uuid-tag-3'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagIds?: string[];

  @ApiPropertyOptional({
    description: 'Job expiration date',
    example: '2024-12-31T23:59:59Z',
  })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @ApiPropertyOptional({
    description: 'Category ID',
    example: 'uuid-category-id',
  })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({
    description: 'Company ID',
    example: 'uuid-company-id',
  })
  @IsString()
  @IsNotEmpty()
  companyId: string;
}

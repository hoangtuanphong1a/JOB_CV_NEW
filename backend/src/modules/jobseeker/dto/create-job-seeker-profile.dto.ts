import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmploymentStatus } from '../../common/entities/job-seeker-profile.entity';
import { Type } from 'class-transformer';

export class CreateJobSeekerProfileDto {
  @ApiPropertyOptional({
    description: 'Professional title',
    example: 'Senior Software Engineer',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Professional summary/bio',
    example: 'Experienced software engineer with 5+ years...',
  })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiPropertyOptional({
    description: 'Current position',
    example: 'Software Engineer',
  })
  @IsString()
  @IsOptional()
  currentPosition?: string;

  @ApiPropertyOptional({
    description: 'Current company',
    example: 'Tech Corp',
  })
  @IsString()
  @IsOptional()
  currentCompany?: string;

  @ApiPropertyOptional({
    description: 'Employment status',
    enum: EmploymentStatus,
    example: EmploymentStatus.EMPLOYED,
  })
  @IsEnum(EmploymentStatus)
  @IsOptional()
  employmentStatus?: EmploymentStatus;

  @ApiPropertyOptional({
    description: 'Minimum expected salary',
    example: 60000,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  expectedSalaryMin?: number;

  @ApiPropertyOptional({
    description: 'Maximum expected salary',
    example: 90000,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  expectedSalaryMax?: number;

  @ApiPropertyOptional({
    description: 'Salary currency',
    example: 'USD',
  })
  @IsString()
  @IsOptional()
  expectedSalaryCurrency?: string;

  @ApiPropertyOptional({
    description: 'LinkedIn profile URL',
    example: 'https://linkedin.com/in/johndoe',
  })
  @IsString()
  @IsOptional()
  linkedinUrl?: string;

  @ApiPropertyOptional({
    description: 'GitHub profile URL',
    example: 'https://github.com/johndoe',
  })
  @IsString()
  @IsOptional()
  githubUrl?: string;

  @ApiPropertyOptional({
    description: 'Portfolio website URL',
    example: 'https://johndoe.dev',
  })
  @IsString()
  @IsOptional()
  portfolioUrl?: string;

  @ApiPropertyOptional({
    description: 'Work phone number',
    example: '+1-555-0123',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Preferred work location',
    example: 'San Francisco, CA',
  })
  @IsString()
  @IsOptional()
  preferredLocation?: string;

  @ApiPropertyOptional({
    description: 'Willing to relocate',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  willingToRelocate?: boolean;

  @ApiPropertyOptional({
    description: 'Prefer remote work',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  remoteWorkPreferred?: boolean;
}

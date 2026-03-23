import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Industry, CompanySize } from '../../common/entities/company.entity';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Company name',
    example: 'Tech Solutions Inc.',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Company description',
    example: 'Leading technology solutions provider',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Company website URL',
    example: 'https://techsolutions.com',
  })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({
    description: 'Company logo URL',
    example: 'https://example.com/logo.png',
  })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiPropertyOptional({
    description: 'Company industry',
    enum: Industry,
    example: Industry.TECHNOLOGY,
  })
  @IsEnum(Industry)
  @IsOptional()
  industry?: Industry;

  @ApiPropertyOptional({
    description: 'Company size',
    enum: CompanySize,
    example: CompanySize.MEDIUM,
  })
  @IsEnum(CompanySize)
  @IsOptional()
  size?: CompanySize;

  @ApiPropertyOptional({
    description: 'Company address',
    example: '123 Business St',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'Company city',
    example: 'San Francisco',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({
    description: 'Company state/province',
    example: 'California',
  })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({
    description: 'Company country',
    example: 'United States',
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({
    description: 'Company postal code',
    example: '94105',
  })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiPropertyOptional({
    description: 'Company phone number',
    example: '+1-555-0123',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Company email',
    example: 'contact@techsolutions.com',
  })
  @IsString()
  @IsOptional()
  email?: string;
}

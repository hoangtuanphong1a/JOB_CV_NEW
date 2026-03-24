import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsUUID,
  IsEnum,
  IsArray,
} from 'class-validator';
import { CompanyUserRole } from '../../common/entities/company-user.entity';

export class CreateCompanyUserDto {
  @ApiProperty({ description: 'Email người dùng', example: 'hr@company.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'ID công ty' })
  @IsUUID()
  companyId!: string;

  @ApiPropertyOptional({
    description: 'Vai trò',
    enum: CompanyUserRole,
    default: CompanyUserRole.HR,
  })
  @IsOptional()
  @IsEnum(CompanyUserRole)
  role?: CompanyUserRole;

  @ApiPropertyOptional({
    description: 'Danh sách quyền',
    example: ['manage_jobs', 'view_applications'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}
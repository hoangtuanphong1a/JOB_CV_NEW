import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsArray, IsString } from 'class-validator';
import { CreateCompanyUserDto } from './create-company-user.dto';
import { CompanyUserRole } from '../../common/entities/company-user.entity';

export class UpdateCompanyUserDto extends PartialType(CreateCompanyUserDto) {
  @ApiPropertyOptional({
    description: 'Vai trò',
    enum: CompanyUserRole,
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
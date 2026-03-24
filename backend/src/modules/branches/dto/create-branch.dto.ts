import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUUID,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ description: 'Tên chi nhánh', example: 'Chi nhánh Hà Nội' })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({ description: 'Địa chỉ chi nhánh' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Thành phố', example: 'Hà Nội' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ description: 'Quốc gia', example: 'Việt Nam' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại', example: '024-1234-5678' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ description: 'Email chi nhánh', example: 'hanoi@company.com' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ description: 'Là trụ sở chính', default: false })
  @IsOptional()
  @IsBoolean()
  isHeadquarter?: boolean;

  @ApiPropertyOptional({ description: 'Số lượng nhân viên', example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  employeeCount?: number;

  @ApiPropertyOptional({ description: 'Vĩ độ (GPS)', example: 21.028511 })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({ description: 'Kinh độ (GPS)', example: 105.804817 })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiProperty({ description: 'ID công ty' })
  @IsUUID()
  companyId!: string;
}

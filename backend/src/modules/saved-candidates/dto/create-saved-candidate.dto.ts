import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsBoolean } from 'class-validator';

export class CreateSavedCandidateDto {
  @ApiProperty({ description: 'ID ứng viên' })
  @IsUUID()
  candidateId!: string;

  @ApiPropertyOptional({ description: 'ID công ty' })
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Nhãn phân loại', example: 'Tiềm năng' })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional({ description: 'Đánh dấu yêu thích', default: false })
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;
}
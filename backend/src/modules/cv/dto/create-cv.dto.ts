import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CVVisibility } from '../../common/entities/cv.entity';

export class CreateCvDto {
  @ApiProperty({
    description: 'CV title',
    example: 'Senior Software Engineer CV',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'CV content in JSON format',
    example: '{"personalInfo": {...}, "experience": [...], "education": [...]}',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'Template ID used for this CV',
    example: 'template-uuid-123',
  })
  @IsString()
  @IsOptional()
  templateId?: string;

  @ApiPropertyOptional({
    description: 'CV visibility settings',
    enum: CVVisibility,
    example: CVVisibility.PRIVATE,
  })
  @IsEnum(CVVisibility)
  @IsOptional()
  visibility?: CVVisibility;
}

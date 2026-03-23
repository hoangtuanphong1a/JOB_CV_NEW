import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationSource } from '../../common/entities/application.entity';

export class CreateApplicationDto {
  @ApiProperty({
    description: 'Job ID to apply for',
    example: 'uuid-job-id',
  })
  @IsString()
  @IsNotEmpty()
  jobId: string;

  @ApiPropertyOptional({
    description: 'Cover letter text',
    example: 'I am very interested in this position...',
  })
  @IsString()
  @IsOptional()
  coverLetter?: string;

  @ApiPropertyOptional({
    description: 'Resume/CV URL',
    example: 'https://example.com/resume.pdf',
  })
  @IsString()
  @IsOptional()
  resumeUrl?: string;

  @ApiPropertyOptional({
    description: 'Application source',
    enum: ApplicationSource,
    example: ApplicationSource.WEBSITE,
  })
  @IsEnum(ApplicationSource)
  @IsOptional()
  source?: ApplicationSource;
}

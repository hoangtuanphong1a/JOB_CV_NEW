import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApplicationStatus } from '../../common/entities/application.entity';

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

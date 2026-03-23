import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSavedJobDto {
  @ApiProperty({
    description: 'Job ID to save',
    example: 'job-uuid-123',
  })
  @IsString()
  @IsNotEmpty()
  jobId: string;
}

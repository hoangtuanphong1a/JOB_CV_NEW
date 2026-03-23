import { PartialType } from '@nestjs/swagger';
import { CreateJobSeekerProfileDto } from './create-job-seeker-profile.dto';

export class UpdateJobSeekerProfileDto extends PartialType(
  CreateJobSeekerProfileDto,
) {}

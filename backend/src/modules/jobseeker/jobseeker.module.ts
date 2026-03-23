import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobseekerController } from './jobseeker.controller';
import { JobseekerService } from './jobseeker.service';
import { JobSeekerProfile } from '../common/entities/job-seeker-profile.entity';
import { JobSeekerEducation } from '../common/entities/job-seeker-education.entity';
import { JobSeekerExperience } from '../common/entities/job-seeker-experience.entity';
import { JobSeekerSkill } from '../common/entities/job-seeker-skill.entity';
import { User } from '../common/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobSeekerProfile,
      JobSeekerEducation,
      JobSeekerExperience,
      JobSeekerSkill,
      User,
    ]),
  ],
  controllers: [JobseekerController],
  providers: [JobseekerService],
  exports: [JobseekerService],
})
export class JobseekerModule {}

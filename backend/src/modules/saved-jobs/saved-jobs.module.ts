import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedJobsController } from './saved-jobs.controller';
import { SavedJobsService } from './saved-jobs.service';
import { SavedJob } from '../common/entities/saved-job.entity';
import { User } from '../common/entities/user.entity';
import { Job } from '../common/entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SavedJob, User, Job])],
  controllers: [SavedJobsController],
  providers: [SavedJobsService],
  exports: [SavedJobsService],
})
export class SavedJobsModule {}

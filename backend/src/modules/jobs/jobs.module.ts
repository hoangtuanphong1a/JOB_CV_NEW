import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { Job } from '../common/entities/job.entity';
import { Company } from '../common/entities/company.entity';
import { User } from '../common/entities/user.entity';
import { Skill } from '../common/entities/skill.entity';
import { JobTag } from '../common/entities/job-tag.entity';
import { JobCategory } from '../common/entities/job-category.entity';
import { JobView } from '../common/entities/job-view.entity';
import { HRModule } from '../hr/hr.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Job,
      Company,
      User,
      Skill,
      JobTag,
      JobCategory,
      JobView,
    ]),
    HRModule,
    SubscriptionsModule,
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}

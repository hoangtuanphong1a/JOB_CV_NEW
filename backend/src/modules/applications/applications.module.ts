import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { Application } from '../common/entities/application.entity';
import { ApplicationEvent } from '../common/entities/application-event.entity';
import { Job } from '../common/entities/job.entity';
import { JobSeekerProfile } from '../common/entities/job-seeker-profile.entity';
import { User } from '../common/entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { HRCompanyRelationshipModule } from '../hr-company-relationship/hr-company-relationship.module';
import { CvModule } from '../cv/cv.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Application,
      ApplicationEvent,
      Job,
      JobSeekerProfile,
      User,
    ]),
    NotificationsModule,
    HRCompanyRelationshipModule,
    CvModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}

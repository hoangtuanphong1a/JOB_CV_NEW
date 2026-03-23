import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from '../common/entities/job.entity';
import { Application } from '../common/entities/application.entity';
import { User } from '../common/entities/user.entity';
import { Company } from '../common/entities/company.entity';
import { UserRole } from '../common/entities/user-role.entity';
import { HRController } from './hr.controller';
import { HRService } from './hr.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { MessagingModule } from '../messaging/messaging.module';
import { HRCompanyRelationshipModule } from '../hr-company-relationship/hr-company-relationship.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, Application, User, Company, UserRole]),
    NotificationsModule,
    MessagingModule,
    HRCompanyRelationshipModule,
  ],
  controllers: [HRController],
  providers: [HRService],
  exports: [HRService],
})
export class HRModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { BlogModule } from '../blog/blog.module';
import { User } from '../common/entities/user.entity';
import { Role } from '../common/entities/role.entity';
import { UserRole } from '../common/entities/user-role.entity';
import { Job } from '../common/entities/job.entity';
import { Company } from '../common/entities/company.entity';
import { Application } from '../common/entities/application.entity';
import { Skill } from '../common/entities/skill.entity';
import { JobCategory } from '../common/entities/job-category.entity';
import { Payment } from '../common/entities/payment.entity';
import { Notification } from '../common/entities/notification.entity';
import { BlogComment } from '../common/entities/blog-comment.entity';

@Module({
  imports: [
    BlogModule,
    TypeOrmModule.forFeature([
      User,
      Role,
      UserRole,
      Job,
      Company,
      Application,
      Skill,
      JobCategory,
      Payment,
      Notification,
      BlogComment,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}

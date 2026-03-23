import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployerController } from './employer.controller';
import { EmployerService } from './employer.service';
import { Job } from '../common/entities/job.entity';
import { Application } from '../common/entities/application.entity';
import { User } from '../common/entities/user.entity';
import { Company } from '../common/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Application, User, Company])],
  controllers: [EmployerController],
  providers: [EmployerService],
  exports: [EmployerService],
})
export class EmployerModule {}

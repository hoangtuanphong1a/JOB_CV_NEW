import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyUsersController } from './company-users.controller';
import { CompanyUsersService } from './company-users.service';
import { CompanyUser } from '../common/entities/company-user.entity';
import { Company } from '../common/entities/company.entity';
import { User } from '../common/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyUser, Company, User])],
  controllers: [CompanyUsersController],
  providers: [CompanyUsersService],
  exports: [CompanyUsersService],
})
export class CompanyUsersModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HRCompanyRelationship } from './hr-company-relationship.entity';
import { HRCompanyRelationshipService } from './hr-company-relationship.service';
import { HRCompanyRelationshipController } from './hr-company-relationship.controller';
import { User } from '../common/entities/user.entity';
import { Company } from '../common/entities/company.entity';
import { UserRole } from '../common/entities/user-role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HRCompanyRelationship, User, Company, UserRole]),
  ],
  controllers: [HRCompanyRelationshipController],
  providers: [HRCompanyRelationshipService],
  exports: [HRCompanyRelationshipService],
})
export class HRCompanyRelationshipModule {}

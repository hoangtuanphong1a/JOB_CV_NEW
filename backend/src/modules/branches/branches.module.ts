import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { Branch } from '../common/entities/branch.entity';
import { Company } from '../common/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Branch, Company])],
  controllers: [BranchesController],
  providers: [BranchesService],
  exports: [BranchesService],
})
export class BranchesModule {}
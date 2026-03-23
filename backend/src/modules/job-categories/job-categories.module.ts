import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobCategoriesController } from './job-categories.controller';
import { JobCategoriesService } from './job-categories.service';
import { JobCategory } from '../common/entities/job-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobCategory])],
  controllers: [JobCategoriesController],
  providers: [JobCategoriesService],
  exports: [JobCategoriesService],
})
export class JobCategoriesModule {}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobCategory } from '../common/entities/job-category.entity';

@Injectable()
export class JobCategoriesService {
  constructor(
    @InjectRepository(JobCategory)
    private jobCategoryRepository: Repository<JobCategory>,
  ) {}

  async create(data: Partial<JobCategory>): Promise<JobCategory> {
    const jobCategory = this.jobCategoryRepository.create(data);
    return this.jobCategoryRepository.save(jobCategory);
  }

  async findAll(): Promise<JobCategory[]> {
    return this.jobCategoryRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<JobCategory> {
    const jobCategory = await this.jobCategoryRepository.findOne({
      where: { id },
    });

    if (!jobCategory) {
      throw new NotFoundException('Job category not found');
    }

    return jobCategory;
  }

  async update(id: string, data: Partial<JobCategory>): Promise<JobCategory> {
    await this.findOne(id);
    await this.jobCategoryRepository.update(id, data);
    const updated = await this.jobCategoryRepository.findOne({ where: { id } });
    if (!updated) {
      throw new NotFoundException('Job category not found after update');
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const jobCategory = await this.findOne(id);
    await this.jobCategoryRepository.remove(jobCategory);
  }
}

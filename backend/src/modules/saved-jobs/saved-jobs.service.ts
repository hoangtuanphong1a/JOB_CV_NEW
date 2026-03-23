import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedJob } from '../common/entities/saved-job.entity';
import { User } from '../common/entities/user.entity';
import { Job } from '../common/entities/job.entity';
import { CreateSavedJobDto } from './dto/create-saved-job.dto';

@Injectable()
export class SavedJobsService {
  constructor(
    @InjectRepository(SavedJob)
    private savedJobRepository: Repository<SavedJob>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async create(
    createSavedJobDto: CreateSavedJobDto,
    userId: string,
  ): Promise<SavedJob> {
    const { jobId } = createSavedJobDto;

    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if job exists and is active
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: ['company'],
    });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Check if job is already saved
    const existingSavedJob = await this.savedJobRepository.findOne({
      where: { user: { id: userId }, job: { id: jobId } },
    });

    if (existingSavedJob) {
      throw new ConflictException('Job is already saved');
    }

    // Create saved job
    const savedJob = this.savedJobRepository.create({
      user: { id: userId },
      job: { id: jobId },
    });

    const result = await this.savedJobRepository.save(savedJob);

    const savedJobWithRelations = await this.savedJobRepository.findOne({
      where: { id: result.id },
      relations: ['user', 'job', 'job.company'],
    });

    if (!savedJobWithRelations) {
      throw new NotFoundException('Failed to retrieve saved job');
    }

    return savedJobWithRelations;
  }

  async findAllByUser(userId: string): Promise<SavedJob[]> {
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.savedJobRepository.find({
      where: { user: { id: userId } },
      relations: ['job', 'job.company', 'job.postedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByJob(jobId: string): Promise<SavedJob[]> {
    // Check if job exists
    const job = await this.jobRepository.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return this.savedJobRepository.find({
      where: { job: { id: jobId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<SavedJob> {
    const savedJob = await this.savedJobRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user', 'job', 'job.company'],
    });

    if (!savedJob) {
      throw new NotFoundException('Saved job not found');
    }

    return savedJob;
  }

  async remove(id: string, userId: string): Promise<void> {
    const savedJob = await this.savedJobRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!savedJob) {
      throw new NotFoundException('Saved job not found');
    }

    await this.savedJobRepository.remove(savedJob);
  }

  async removeByJobId(jobId: string, userId: string): Promise<void> {
    const savedJob = await this.savedJobRepository.findOne({
      where: { job: { id: jobId }, user: { id: userId } },
    });

    if (!savedJob) {
      throw new NotFoundException('Saved job not found');
    }

    await this.savedJobRepository.remove(savedJob);
  }

  async isJobSaved(jobId: string, userId: string): Promise<boolean> {
    const count = await this.savedJobRepository.count({
      where: { job: { id: jobId }, user: { id: userId } },
    });

    return count > 0;
  }

  async getSavedJobsCount(userId: string): Promise<number> {
    return this.savedJobRepository.count({
      where: { user: { id: userId } },
    });
  }

  async getJobSavedCount(jobId: string): Promise<number> {
    return this.savedJobRepository.count({
      where: { job: { id: jobId } },
    });
  }

  async toggleSave(
    jobId: string,
    userId: string,
  ): Promise<{ saved: boolean; savedJob?: SavedJob }> {
    const isSaved = await this.isJobSaved(jobId, userId);

    if (isSaved) {
      await this.removeByJobId(jobId, userId);
      return { saved: false };
    } else {
      const savedJob = await this.create({ jobId }, userId);
      return { saved: true, savedJob };
    }
  }

  async getSavedJobsStats(userId: string): Promise<{
    totalSaved: number;
    recentSaves: SavedJob[];
  }> {
    const totalSaved = await this.getSavedJobsCount(userId);

    const recentSaves = await this.savedJobRepository.find({
      where: { user: { id: userId } },
      relations: ['job', 'job.company'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      totalSaved,
      recentSaves,
    };
  }
}

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobSeekerProfile } from '../common/entities/job-seeker-profile.entity';
import { User } from '../common/entities/user.entity';
import { CreateJobSeekerProfileDto } from './dto/create-job-seeker-profile.dto';
import { UpdateJobSeekerProfileDto } from './dto/update-job-seeker-profile.dto';

@Injectable()
export class JobseekerService {
  constructor(
    @InjectRepository(JobSeekerProfile)
    private profileRepository: Repository<JobSeekerProfile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createProfile(
    userId: string,
    createDto: CreateJobSeekerProfileDto,
  ): Promise<JobSeekerProfile> {
    // Check if profile already exists
    const existingProfile = await this.profileRepository.findOne({
      where: { userId },
    });

    if (existingProfile) {
      throw new ConflictException(
        'Job seeker profile already exists for this user',
      );
    }

    // Verify user exists
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create profile
    const profile = this.profileRepository.create({
      ...createDto,
      userId,
      user,
    });

    return this.profileRepository.save(profile);
  }

  async findProfile(userId: string): Promise<JobSeekerProfile> {
    const profile = await this.profileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Job seeker profile not found');
    }

    return profile;
  }

  async updateProfile(
    userId: string,
    updateDto: UpdateJobSeekerProfileDto,
  ): Promise<JobSeekerProfile> {
    const profile = await this.findProfile(userId);

    await this.profileRepository.update(profile.id, updateDto);

    return this.findProfile(userId);
  }

  async deleteProfile(userId: string): Promise<void> {
    const profile = await this.findProfile(userId);
    await this.profileRepository.remove(profile);
  }
}

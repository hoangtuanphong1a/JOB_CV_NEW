import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CV, CVStatus, CVVisibility } from '../common/entities/cv.entity';
import { User } from '../common/entities/user.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(CV)
    private cvRepository: Repository<CV>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createCvDto: CreateCvDto, userId: string): Promise<CV> {
    // Get job seeker profile for the user
    const jobSeekerProfile = await this.userRepository
      .findOne({
        where: { id: userId },
        relations: ['jobSeekerProfiles'],
      })
      .then((user) => user?.jobSeekerProfiles?.[0]);

    if (!jobSeekerProfile) {
      throw new NotFoundException(
        'Job seeker profile not found. Please complete your profile first.',
      );
    }

    // Create CV
    const cv = this.cvRepository.create({
      ...createCvDto,
      jobSeekerProfileId: jobSeekerProfile.id,
      jobSeekerProfile,
    });

    return this.cvRepository.save(cv);
  }

  async findAll(query: any): Promise<{
    data: CV[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, status, visibility, userId } = query;

    const skip = (page - 1) * limit;
    const where: any = {};

    // Add filters
    if (status) where.status = status;
    if (visibility) where.visibility = visibility;
    if (userId) {
      // Find job seeker profile for userId
      const jobSeekerProfile = await this.userRepository
        .findOne({
          where: { id: userId },
          relations: ['jobSeekerProfiles'],
        })
        .then((user) => user?.jobSeekerProfiles?.[0]);

      if (jobSeekerProfile) {
        where.jobSeekerProfileId = jobSeekerProfile.id;
      }
    }

    const [cvs, total] = await this.cvRepository.findAndCount({
      where,
      relations: ['jobSeekerProfile'],
      skip,
      take: limit,
      order: { updatedAt: 'DESC' },
    });

    return {
      data: cvs,
      total,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<CV> {
    const cv = await this.cvRepository.findOne({
      where: { id },
      relations: ['jobSeekerProfile'],
    });

    if (!cv) {
      throw new NotFoundException('CV not found');
    }

    return cv;
  }

  async findByUser(userId: string): Promise<CV[]> {
    // Find job seeker profile for the user
    const jobSeekerProfile = await this.userRepository
      .findOne({
        where: { id: userId },
        relations: ['jobSeekerProfiles'],
      })
      .then((user) => user?.jobSeekerProfiles?.[0]);

    if (!jobSeekerProfile) {
      return [];
    }

    return this.cvRepository.find({
      where: { jobSeekerProfileId: jobSeekerProfile.id },
      relations: ['jobSeekerProfile'],
      order: { updatedAt: 'DESC' },
    });
  }

  async findPublicCv(publicUrl: string): Promise<CV> {
    const cv = await this.cvRepository.findOne({
      where: { publicUrl },
      relations: ['jobSeekerProfile'],
    });

    if (!cv) {
      throw new NotFoundException('CV not found');
    }

    if (!cv.canBeViewedByEmployer) {
      throw new ForbiddenException('CV is not publicly accessible');
    }

    // Increment view count
    await this.incrementViewCount(cv.id);

    return cv;
  }

  async update(
    id: string,
    updateCvDto: UpdateCvDto,
    userId: string,
  ): Promise<CV> {
    const cv = await this.findOne(id);

    // Check if user owns this CV
    if (cv.jobSeekerProfile.userId !== userId) {
      throw new ForbiddenException('You can only update your own CVs');
    }

    await this.cvRepository.update(id, {
      ...updateCvDto,
      lastModifiedAt: new Date(),
    });

    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    const cv = await this.findOne(id);

    // Check if user owns this CV
    if (cv.jobSeekerProfile.userId !== userId) {
      throw new ForbiddenException('You can only delete your own CVs');
    }

    await this.cvRepository.remove(cv);
  }

  async publishCv(id: string, userId: string): Promise<CV> {
    const cv = await this.findOne(id);

    if (cv.jobSeekerProfile.userId !== userId) {
      throw new ForbiddenException('You can only publish your own CVs');
    }

    if (cv.status === CVStatus.PUBLISHED) {
      throw new ForbiddenException('CV is already published');
    }

    await this.cvRepository.update(id, {
      status: CVStatus.PUBLISHED,
      lastModifiedAt: new Date(),
    });

    return this.findOne(id);
  }

  async archiveCv(id: string, userId: string): Promise<CV> {
    const cv = await this.findOne(id);

    if (cv.jobSeekerProfile.userId !== userId) {
      throw new ForbiddenException('You can only archive your own CVs');
    }

    await this.cvRepository.update(id, {
      status: CVStatus.ARCHIVED,
      lastModifiedAt: new Date(),
    });

    return this.findOne(id);
  }

  async generateShareLink(id: string, userId: string): Promise<string> {
    const cv = await this.findOne(id);

    if (cv.jobSeekerProfile.userId !== userId) {
      throw new ForbiddenException('You can only share your own CVs');
    }

    // Generate a unique public URL
    const publicUrl = `cv-${id}-${Date.now()}`;

    await this.cvRepository.update(id, {
      publicUrl,
      visibility: CVVisibility.PUBLIC,
      lastModifiedAt: new Date(),
    });

    return publicUrl;
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.cvRepository.increment({ id }, 'viewCount', 1);
  }

  async incrementDownloadCount(id: string): Promise<void> {
    await this.cvRepository.increment({ id }, 'downloadCount', 1);
  }

  async getCvStats(userId: string): Promise<{
    totalCvs: number;
    publishedCvs: number;
    totalViews: number;
    totalDownloads: number;
  }> {
    // Find job seeker profile for the user
    const jobSeekerProfile = await this.userRepository
      .findOne({
        where: { id: userId },
        relations: ['jobSeekerProfiles'],
      })
      .then((user) => user?.jobSeekerProfiles?.[0]);

    if (!jobSeekerProfile) {
      return {
        totalCvs: 0,
        publishedCvs: 0,
        totalViews: 0,
        totalDownloads: 0,
      };
    }

    const cvs = await this.cvRepository.find({
      where: { jobSeekerProfileId: jobSeekerProfile.id },
    });

    const publishedCvs = cvs.filter(
      (cv) => cv.status === CVStatus.PUBLISHED,
    ).length;
    const totalViews = cvs.reduce((sum, cv) => sum + cv.viewCount, 0);
    const totalDownloads = cvs.reduce((sum, cv) => sum + cv.downloadCount, 0);

    return {
      totalCvs: cvs.length,
      publishedCvs,
      totalViews,
      totalDownloads,
    };
  }

  async setPrimaryCv(cvId: string, userId: string): Promise<CV> {
    const cv = await this.findOne(cvId);

    // Check if user owns this CV
    if (cv.jobSeekerProfile.userId !== userId) {
      throw new ForbiddenException('You can only modify your own CVs');
    }

    // Check if CV is published (only published CVs can be primary)
    if (cv.status !== CVStatus.PUBLISHED) {
      throw new ForbiddenException('Only published CVs can be set as primary');
    }

    // Unset all other primary CVs for this user
    await this.cvRepository.update(
      {
        jobSeekerProfileId: cv.jobSeekerProfileId,
        isPrimary: true,
      },
      { isPrimary: false },
    );

    // Set this CV as primary
    await this.cvRepository.update(cvId, {
      isPrimary: true,
      lastModifiedAt: new Date(),
    });

    return this.findOne(cvId);
  }

  async unsetPrimaryCv(cvId: string, userId: string): Promise<CV> {
    const cv = await this.findOne(cvId);

    // Check if user owns this CV
    if (cv.jobSeekerProfile.userId !== userId) {
      throw new ForbiddenException('You can only modify your own CVs');
    }

    await this.cvRepository.update(cvId, {
      isPrimary: false,
      lastModifiedAt: new Date(),
    });

    return this.findOne(cvId);
  }

  async getPrimaryCv(userId: string): Promise<CV | null> {
    // Find job seeker profile for the user
    const jobSeekerProfile = await this.userRepository
      .findOne({
        where: { id: userId },
        relations: ['jobSeekerProfiles'],
      })
      .then((user) => user?.jobSeekerProfiles?.[0]);

    if (!jobSeekerProfile) {
      return null;
    }

    const primaryCv = await this.cvRepository.findOne({
      where: {
        jobSeekerProfileId: jobSeekerProfile.id,
        isPrimary: true,
        status: CVStatus.PUBLISHED, // Only published CVs can be primary
      },
      relations: ['jobSeekerProfile'],
    });

    return primaryCv;
  }

  async getPrimaryCvOrFirst(userId: string): Promise<CV | null> {
    // Try to get primary CV first
    const primaryCv = await this.getPrimaryCv(userId);
    if (primaryCv) {
      return primaryCv;
    }

    // If no primary CV, get the first published CV
    const jobSeekerProfile = await this.userRepository
      .findOne({
        where: { id: userId },
        relations: ['jobSeekerProfiles'],
      })
      .then((user) => user?.jobSeekerProfiles?.[0]);

    if (!jobSeekerProfile) {
      return null;
    }

    const firstPublishedCv = await this.cvRepository.findOne({
      where: {
        jobSeekerProfileId: jobSeekerProfile.id,
        status: CVStatus.PUBLISHED,
      },
      relations: ['jobSeekerProfile'],
      order: { updatedAt: 'DESC' }, // Get most recently updated
    });

    return firstPublishedCv;
  }
}

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedCandidate } from '../common/entities/saved-candidate.entity';
import { User } from '../common/entities/user.entity';
import { CreateSavedCandidateDto } from './dto/create-saved-candidate.dto';

@Injectable()
export class SavedCandidatesService {
  constructor(
    @InjectRepository(SavedCandidate)
    private savedCandidateRepository: Repository<SavedCandidate>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async save(createDto: CreateSavedCandidateDto, employerId: string) {
    // Check if candidate exists
    const candidate = await this.userRepository.findOne({
      where: { id: createDto.candidateId },
    });

    if (!candidate) {
      throw new NotFoundException('Không tìm thấy ứng viên');
    }

    // Check if already saved
    const existing = await this.savedCandidateRepository.findOne({
      where: { employerId, candidateId: createDto.candidateId },
    });

    if (existing) {
      throw new ConflictException('Đã lưu hồ sơ này rồi');
    }

    const savedCandidate = this.savedCandidateRepository.create({
      ...createDto,
      employerId,
    });

    return this.savedCandidateRepository.save(savedCandidate);
  }

  async findAll(employerId: string, query: any) {
    const { page = 1, limit = 10, label, isFavorite } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.savedCandidateRepository
      .createQueryBuilder('savedCandidate')
      .leftJoinAndSelect('savedCandidate.candidate', 'candidate')
      .where('savedCandidate.employerId = :employerId', { employerId });

    if (label) {
      queryBuilder.andWhere('savedCandidate.label = :label', { label });
    }

    if (isFavorite !== undefined) {
      queryBuilder.andWhere('savedCandidate.isFavorite = :isFavorite', { isFavorite });
    }

    const [candidates, total] = await queryBuilder
      .orderBy('savedCandidate.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: candidates,
      total,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, employerId: string) {
    const savedCandidate = await this.savedCandidateRepository.findOne({
      where: { id, employerId },
      relations: ['candidate'],
    });

    if (!savedCandidate) {
      throw new NotFoundException('Không tìm thấy bản ghi');
    }

    return savedCandidate;
  }

  async unsave(id: string, employerId: string) {
    const savedCandidate = await this.findOne(id, employerId);
    await this.savedCandidateRepository.remove(savedCandidate);
  }

  async unsaveByCandidateId(candidateId: string, employerId: string) {
    const savedCandidate = await this.savedCandidateRepository.findOne({
      where: { candidateId, employerId },
    });

    if (savedCandidate) {
      await this.savedCandidateRepository.remove(savedCandidate);
    }
  }

  async toggleSave(candidateId: string, employerId: string) {
    const existing = await this.savedCandidateRepository.findOne({
      where: { candidateId, employerId },
    });

    if (existing) {
      await this.savedCandidateRepository.remove(existing);
      return { saved: false, message: 'Đã bỏ lưu' };
    } else {
      const savedCandidate = this.savedCandidateRepository.create({
        candidateId,
        employerId,
      });
      await this.savedCandidateRepository.save(savedCandidate);
      return { saved: true, message: 'Đã lưu' };
    }
  }

  async toggleFavorite(id: string, employerId: string) {
    const savedCandidate = await this.findOne(id, employerId);
    savedCandidate.isFavorite = !savedCandidate.isFavorite;
    return this.savedCandidateRepository.save(savedCandidate);
  }

  async updateLabel(id: string, label: string, employerId: string) {
    const savedCandidate = await this.findOne(id, employerId);
    savedCandidate.label = label;
    return this.savedCandidateRepository.save(savedCandidate);
  }

  async updateNotes(id: string, notes: string, employerId: string) {
    const savedCandidate = await this.findOne(id, employerId);
    savedCandidate.notes = notes;
    return this.savedCandidateRepository.save(savedCandidate);
  }

  async checkSaved(candidateId: string, employerId: string) {
    const savedCandidate = await this.savedCandidateRepository.findOne({
      where: { candidateId, employerId },
    });

    return {
      isSaved: !!savedCandidate,
      savedId: savedCandidate?.id || null,
    };
  }

  async getStatistics(employerId: string) {
    const totalSaved = await this.savedCandidateRepository.count({
      where: { employerId },
    });

    const favorites = await this.savedCandidateRepository.count({
      where: { employerId, isFavorite: true },
    });

    const byLabel = await this.savedCandidateRepository
      .createQueryBuilder('savedCandidate')
      .select('savedCandidate.label', 'label')
      .addSelect('COUNT(*)', 'count')
      .where('savedCandidate.employerId = :employerId', { employerId })
      .andWhere('savedCandidate.label IS NOT NULL')
      .groupBy('savedCandidate.label')
      .getRawMany();

    return {
      totalSaved,
      favorites,
      byLabel,
    };
  }
}
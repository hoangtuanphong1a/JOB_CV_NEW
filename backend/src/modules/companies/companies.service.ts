import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Company } from '../common/entities/company.entity';
import { User } from '../common/entities/user.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    userId: string,
  ): Promise<Company> {
    // Check if company name already exists
    const existingCompany = await this.companyRepository.findOne({
      where: { name: createCompanyDto.name },
    });

    if (existingCompany) {
      throw new ConflictException('Company with this name already exists');
    }

    // Verify user exists
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Create company
    const company = this.companyRepository.create({
      ...createCompanyDto,
      ownerId: userId,
      owner: user,
    });

    return this.companyRepository.save(company);
  }

  async findAll(query: any): Promise<{
    data: Company[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, search, industry, size } = query;

    const skip = (page - 1) * limit;
    const where: any = {};

    // Add search filter
    if (search) {
      where.name = ILike(`%${search}%`);
    }

    // Add industry filter
    if (industry) {
      where.industry = industry;
    }

    // Add size filter
    if (size) {
      where.size = size;
    }

    const [companies, total] = await this.companyRepository.findAndCount({
      where,
      relations: ['owner'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: companies,
      total,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    userId: string,
  ): Promise<Company> {
    const company = await this.findOne(id);

    // Check if user is the owner
    if (company.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own companies');
    }

    // Check if name is being changed and if it conflicts
    if (updateCompanyDto.name && updateCompanyDto.name !== company.name) {
      const existingCompany = await this.companyRepository.findOne({
        where: { name: updateCompanyDto.name },
      });

      if (existingCompany) {
        throw new ConflictException('Company with this name already exists');
      }
    }

    // Update company
    await this.companyRepository.update(id, updateCompanyDto);

    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    const company = await this.findOne(id);

    // Check if user is the owner
    if (company.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own companies');
    }

    await this.companyRepository.remove(company);
  }

  async findByOwner(ownerId: string): Promise<Company[]> {
    return this.companyRepository.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });
  }
}

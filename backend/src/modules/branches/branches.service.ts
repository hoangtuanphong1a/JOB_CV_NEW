import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '../common/entities/branch.entity';
import { Company } from '../common/entities/company.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async create(createBranchDto: CreateBranchDto, userId: string) {
    // Verify company ownership
    const company = await this.companyRepository.findOne({
      where: { id: createBranchDto.companyId, ownerId: userId },
    });

    if (!company) {
      throw new ForbiddenException('Bạn không có quyền thêm chi nhánh cho công ty này');
    }

    // If setting as headquarter, unset other headquarters
    if (createBranchDto.isHeadquarter) {
      await this.branchRepository.update(
        { companyId: createBranchDto.companyId, isHeadquarter: true },
        { isHeadquarter: false },
      );
    }

    const branch = this.branchRepository.create(createBranchDto);
    return this.branchRepository.save(branch);
  }

  async findAllByCompany(companyId: string, userId: string, query: any) {
    // Verify company ownership
    const company = await this.companyRepository.findOne({
      where: { id: companyId, ownerId: userId },
    });

    if (!company) {
      throw new ForbiddenException('Bạn không có quyền xem chi nhánh của công ty này');
    }

    const { page = 1, limit = 10, isActive } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.branchRepository
      .createQueryBuilder('branch')
      .where('branch.companyId = :companyId', { companyId });

    if (isActive !== undefined) {
      queryBuilder.andWhere('branch.isActive = :isActive', { isActive });
    }

    const [branches, total] = await queryBuilder
      .orderBy('branch.isHeadquarter', 'DESC')
      .addOrderBy('branch.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: branches,
      total,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string) {
    const branch = await this.branchRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!branch) {
      throw new NotFoundException('Không tìm thấy chi nhánh');
    }

    // Verify company ownership
    if (branch.company.ownerId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem chi nhánh này');
    }

    return branch;
  }

  async update(id: string, updateBranchDto: UpdateBranchDto, userId: string) {
    const branch = await this.findOne(id, userId);

    // If setting as headquarter, unset other headquarters
    if (updateBranchDto.isHeadquarter) {
      await this.branchRepository.update(
        { companyId: branch.companyId, isHeadquarter: true },
        { isHeadquarter: false },
      );
    }

    Object.assign(branch, updateBranchDto);
    return this.branchRepository.save(branch);
  }

  async remove(id: string, userId: string) {
    const branch = await this.findOne(id, userId);

    if (branch.isHeadquarter) {
      throw new BadRequestException('Không thể xóa trụ sở chính');
    }

    await this.branchRepository.remove(branch);
  }

  async setAsHeadquarter(id: string, userId: string) {
    const branch = await this.findOne(id, userId);

    // Unset other headquarters
    await this.branchRepository.update(
      { companyId: branch.companyId, isHeadquarter: true },
      { isHeadquarter: false },
    );

    branch.isHeadquarter = true;
    return this.branchRepository.save(branch);
  }

  async toggleStatus(id: string, userId: string) {
    const branch = await this.findOne(id, userId);
    branch.isActive = !branch.isActive;
    return this.branchRepository.save(branch);
  }

  async getStatistics(companyId: string, userId: string) {
    // Verify company ownership
    const company = await this.companyRepository.findOne({
      where: { id: companyId, ownerId: userId },
    });

    if (!company) {
      throw new ForbiddenException('Bạn không có quyền xem thống kê của công ty này');
    }

    const totalBranches = await this.branchRepository.count({
      where: { companyId },
    });

    const activeBranches = await this.branchRepository.count({
      where: { companyId, isActive: true },
    });

    const headquarters = await this.branchRepository.findOne({
      where: { companyId, isHeadquarter: true },
    });

    return {
      totalBranches,
      activeBranches,
      inactiveBranches: totalBranches - activeBranches,
      headquarters: headquarters || null,
    };
  }
}
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyUser, CompanyUserRole } from '../common/entities/company-user.entity';
import { Company } from '../common/entities/company.entity';
import { User } from '../common/entities/user.entity';
import { CreateCompanyUserDto } from './dto/create-company-user.dto';
import { UpdateCompanyUserDto } from './dto/update-company-user.dto';

@Injectable()
export class CompanyUsersService {
  constructor(
    @InjectRepository(CompanyUser)
    private companyUserRepository: Repository<CompanyUser>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async inviteUser(createDto: CreateCompanyUserDto, inviterId: string) {
    // Verify company ownership or admin role
    const company = await this.companyRepository.findOne({
      where: { id: createDto.companyId, ownerId: inviterId },
    });

    if (!company) {
      throw new ForbiddenException('Bạn không có quyền mời thành viên cho công ty này');
    }

    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { email: createDto.email },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng với email này');
    }

    // Check if user is already a member
    const existingMember = await this.companyUserRepository.findOne({
      where: { companyId: createDto.companyId, userId: user.id },
    });

    if (existingMember) {
      throw new ConflictException('Người dùng đã là thành viên của công ty');
    }

    const companyUser = this.companyUserRepository.create({
      companyId: createDto.companyId,
      userId: user.id,
      role: createDto.role || CompanyUserRole.HR,
      permissions: createDto.permissions,
      invitedBy: inviterId,
      invitedAt: new Date(),
    });

    return this.companyUserRepository.save(companyUser);
  }

  async findAllByCompany(companyId: string, userId: string, query: any) {
    // Verify company ownership
    const company = await this.companyRepository.findOne({
      where: { id: companyId, ownerId: userId },
    });

    if (!company) {
      throw new ForbiddenException('Bạn không có quyền xem thành viên của công ty này');
    }

    const { page = 1, limit = 10, role } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.companyUserRepository
      .createQueryBuilder('companyUser')
      .leftJoinAndSelect('companyUser.user', 'user')
      .where('companyUser.companyId = :companyId', { companyId });

    if (role) {
      queryBuilder.andWhere('companyUser.role = :role', { role });
    }

    const [members, total] = await queryBuilder
      .orderBy('companyUser.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: members,
      total,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string) {
    const member = await this.companyUserRepository.findOne({
      where: { id },
      relations: ['company', 'user'],
    });

    if (!member) {
      throw new NotFoundException('Không tìm thấy thành viên');
    }

    // Verify company ownership
    if (member.company.ownerId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem thông tin này');
    }

    return member;
  }

  async updateRole(id: string, updateDto: UpdateCompanyUserDto, userId: string) {
    const member = await this.findOne(id, userId);

    if (member.role === CompanyUserRole.OWNER) {
      throw new ForbiddenException('Không thể thay đổi vai trò của chủ sở hữu');
    }

    member.role = updateDto.role || member.role;
    return this.companyUserRepository.save(member);
  }

  async updatePermissions(id: string, permissions: string[], userId: string) {
    const member = await this.findOne(id, userId);

    if (member.role === CompanyUserRole.OWNER) {
      throw new ForbiddenException('Không thể thay đổi quyền của chủ sở hữu');
    }

    member.permissions = permissions;
    return this.companyUserRepository.save(member);
  }

  async remove(id: string, userId: string) {
    const member = await this.findOne(id, userId);

    if (member.role === CompanyUserRole.OWNER) {
      throw new ForbiddenException('Không thể xóa chủ sở hữu khỏi công ty');
    }

    await this.companyUserRepository.remove(member);
  }

  async deactivate(id: string, userId: string) {
    const member = await this.findOne(id, userId);

    if (member.role === CompanyUserRole.OWNER) {
      throw new ForbiddenException('Không thể vô hiệu hóa chủ sở hữu');
    }

    member.isActive = false;
    return this.companyUserRepository.save(member);
  }

  async activate(id: string, userId: string) {
    const member = await this.findOne(id, userId);
    member.isActive = true;
    member.acceptedAt = new Date();
    return this.companyUserRepository.save(member);
  }

  async getStatistics(companyId: string, userId: string) {
    // Verify company ownership
    const company = await this.companyRepository.findOne({
      where: { id: companyId, ownerId: userId },
    });

    if (!company) {
      throw new ForbiddenException('Bạn không có quyền xem thống kê của công ty này');
    }

    const totalMembers = await this.companyUserRepository.count({
      where: { companyId },
    });

    const activeMembers = await this.companyUserRepository.count({
      where: { companyId, isActive: true },
    });

    const membersByRole = await this.companyUserRepository
      .createQueryBuilder('companyUser')
      .select('companyUser.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .where('companyUser.companyId = :companyId', { companyId })
      .groupBy('companyUser.role')
      .getRawMany();

    return {
      totalMembers,
      activeMembers,
      inactiveMembers: totalMembers - activeMembers,
      membersByRole,
    };
  }
}
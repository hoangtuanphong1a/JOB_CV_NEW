import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HRCompanyRelationship } from './hr-company-relationship.entity';
import { User } from '../common/entities/user.entity';
import { Company } from '../common/entities/company.entity';

@Injectable()
export class HRCompanyRelationshipService {
  constructor(
    @InjectRepository(HRCompanyRelationship)
    private readonly relationshipRepository: Repository<HRCompanyRelationship>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async assignHRToCompany(
    hrUserId: string,
    companyId: string,
    hrRole?: string,
    permissions?: object,
  ): Promise<HRCompanyRelationship> {
    // Verify HR user exists and has HR role
    const hrUser = await this.userRepository.findOne({
      where: { id: hrUserId },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!hrUser) {
      throw new NotFoundException('HR user not found');
    }

    const hasHRRole = hrUser.userRoles?.some(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      (userRole) => userRole.role.name === 'hr',
    );
    if (!hasHRRole) {
      throw new ForbiddenException(
        'User must have HR role to be assigned to a company',
      );
    }

    // Verify company exists
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // Check if relationship already exists
    const existingRelationship = await this.relationshipRepository.findOne({
      where: { hrUserId, companyId },
    });

    if (existingRelationship) {
      throw new ForbiddenException(
        'HR user is already assigned to this company',
      );
    }

    // Create new relationship
    const relationship = this.relationshipRepository.create({
      hrUserId,
      companyId,
      hrRole: hrRole || 'HR Specialist',
      permissions: permissions || {},
      isActive: true,
    });

    return this.relationshipRepository.save(relationship);
  }

  async removeHRFromCompany(
    hrUserId: string,
    companyId: string,
  ): Promise<void> {
    const relationship = await this.relationshipRepository.findOne({
      where: { hrUserId, companyId },
    });

    if (!relationship) {
      throw new NotFoundException('HR-Company relationship not found');
    }

    await this.relationshipRepository.remove(relationship);
  }

  async getHRForCompany(companyId: string): Promise<HRCompanyRelationship[]> {
    return this.relationshipRepository.find({
      where: { companyId, isActive: true },
      relations: ['hrUser'],
    });
  }

  async getCompaniesForHR(hrUserId: string): Promise<HRCompanyRelationship[]> {
    return this.relationshipRepository.find({
      where: { hrUserId, isActive: true },
      relations: ['company'],
    });
  }

  async updateHRRole(
    hrUserId: string,
    companyId: string,
    hrRole: string,
    permissions?: object,
  ): Promise<HRCompanyRelationship> {
    const relationship = await this.relationshipRepository.findOne({
      where: { hrUserId, companyId },
    });

    if (!relationship) {
      throw new NotFoundException('HR-Company relationship not found');
    }

    relationship.hrRole = hrRole;
    if (permissions !== undefined) {
      relationship.permissions = permissions;
    }

    return this.relationshipRepository.save(relationship);
  }

  async toggleHRStatus(
    hrUserId: string,
    companyId: string,
    isActive: boolean,
  ): Promise<HRCompanyRelationship> {
    const relationship = await this.relationshipRepository.findOne({
      where: { hrUserId, companyId },
    });

    if (!relationship) {
      throw new NotFoundException('HR-Company relationship not found');
    }

    relationship.isActive = isActive;
    return this.relationshipRepository.save(relationship);
  }

  async isHRForCompany(hrUserId: string, companyId: string): Promise<boolean> {
    const relationship = await this.relationshipRepository.findOne({
      where: { hrUserId, companyId, isActive: true },
    });
    return !!relationship;
  }

  async getHRCompaniesForUser(userId: string): Promise<Company[]> {
    const relationships = await this.relationshipRepository.find({
      where: { hrUserId: userId, isActive: true },
      relations: ['company'],
    });

    return relationships.map((relationship) => relationship.company);
  }
}

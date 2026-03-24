import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../common/entities/user.entity';
import { Role, RoleName } from '../common/entities/role.entity';
import { UserRole } from '../common/entities/user-role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, role, ...userData } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = this.userRepository.create({
      ...userData,
      email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // Assign role if provided
    if (role) {
      await this.assignRole(savedUser.id, role);
    } else {
      // Default to JOB_SEEKER if no role specified
      await this.assignRole(savedUser.id, RoleName.JOB_SEEKER);
    }

    return this.findOne(savedUser.id);
  }

  async findAll(query: any): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, search, role, isActive } = query;

    const skip = (page - 1) * limit;
    const where: any = {};

    // Add filters
    if (search) {
      where.fullName = `%${search}%`;
    }
    if (role) where.role = role;
    if (isActive !== undefined) where.status = isActive ? 'active' : 'inactive';

    const [users, total] = await this.userRepository.findAndCount({
      where,
      relations: ['userRoles', 'userRoles.role'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: users,
      total,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['userRoles', 'userRoles.role'],
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUserId: string,
  ): Promise<User> {
    const user = await this.findOne(id);

    // Check if user can update (only admin or self)
    const isAdmin = await this.hasRole(currentUserId, RoleName.ADMIN);

    if (!isAdmin && currentUserId !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    // Prepare update data with proper field mapping
    const updateData: any = {};
    
    // Map fullName to firstName and lastName
    if (updateUserDto.fullName) {
      const nameParts = updateUserDto.fullName.trim().split(' ');
      if (nameParts.length > 0) {
        updateData.firstName = nameParts[0];
        if (nameParts.length > 1) {
          updateData.lastName = nameParts.slice(1).join(' ');
        }
      }
    }
    
    // Map location to address
    if (updateUserDto.location) {
      updateData.address = updateUserDto.location;
    }
    
    // Map bio to summary
    if (updateUserDto.bio) {
      updateData.summary = updateUserDto.bio;
    }
    
    // Map other fields directly
    if (updateUserDto.email) updateData.email = updateUserDto.email;
    if (updateUserDto.phone) updateData.phone = updateUserDto.phone;
    if (updateUserDto.avatar) updateData.avatar = updateUserDto.avatar;
    if (updateUserDto.website) updateData.website = updateUserDto.website;
    if (updateUserDto.linkedinUrl) updateData.linkedinUrl = updateUserDto.linkedinUrl;
    if (updateUserDto.githubUrl) updateData.githubUrl = updateUserDto.githubUrl;
    if (updateUserDto.isActive !== undefined) updateData.isActive = updateUserDto.isActive;

    // Hash password if provided
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 12);
    }

    // Only update role if explicitly provided and user is admin
    if (updateUserDto.role && isAdmin) {
      await this.updateUserRole(id, updateUserDto.role);
    }

    await this.userRepository.update(id, updateData);

    return this.findOne(id);
  }

  async remove(id: string, currentUserId: string): Promise<void> {
    const user = await this.findOne(id);

    // Check if user can delete (only admin)
    const isAdmin = await this.hasRole(currentUserId, RoleName.ADMIN);
    if (!isAdmin) {
      throw new ForbiddenException('Only admin can delete users');
    }

    await this.userRepository.remove(user);
  }

  async assignRole(userId: string, roleName: RoleName): Promise<void> {
    const user = await this.findOne(userId);
    const role = await this.roleRepository.findOne({
      where: { name: roleName },
    });

    if (!role) {
      throw new NotFoundException(`Role ${roleName} not found`);
    }

    // Remove existing roles
    await this.userRoleRepository.delete({ user: { id: userId } });

    // Assign new role
    const userRole = this.userRoleRepository.create({
      user: { id: userId },
      role: { id: role.id },
    });

    await this.userRoleRepository.save(userRole);
  }

  async updateUserRole(userId: string, roleName: RoleName): Promise<void> {
    await this.assignRole(userId, roleName);
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    const userRoles = await this.userRoleRepository.find({
      where: { user: { id: userId } },
      relations: ['role'],
    });

    return userRoles.map((userRole) => userRole.role);
  }

  async hasRole(userId: string, roleName: RoleName): Promise<boolean> {
    const roles = await this.getUserRoles(userId);
    return roles.some((role) => role.name === roleName);
  }

  async getUserRoleNames(userId: string): Promise<RoleName[]> {
    const roles = await this.getUserRoles(userId);
    return roles.map((role) => role.name);
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.userRepository.update(userId, { password: hashedPassword });
  }

  async activateUser(userId: string): Promise<User> {
    await this.userRepository.update(userId, { status: 'active' });
    return this.findOne(userId);
  }

  async deactivateUser(userId: string): Promise<User> {
    await this.userRepository.update(userId, { status: 'inactive' });
    return this.findOne(userId);
  }

  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
  }> {
    const [totalUsers, activeUsers] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { status: 'active' } }),
    ]);

    return {
      totalUsers,
      activeUsers,
    };
  }
}

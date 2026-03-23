import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bcrypt from 'bcryptjs';
import { User, UserStatus } from '../common/entities/user.entity';
import { Role, RoleName } from '../common/entities/role.entity';
import { UserRole } from '../common/entities/user-role.entity';
import { Company } from '../common/entities/company.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ access_token: string; refresh_token: string; user: any }> {
    const { email, password, role: roleName } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Validate role
    const validRoles = Object.values(RoleName);
    if (!validRoles.includes(roleName)) {
      throw new BadRequestException('Invalid role specified');
    }

    // Create user
    const user = this.userRepository.create({
      email,
      password, // Will be hashed by BeforeInsert hook
      status: UserStatus.ACTIVE,
    });

    const savedUser = await this.userRepository.save(user);

    // Assign role (case-insensitive search)
    const role = await this.roleRepository
      .createQueryBuilder('role')
      .where('LOWER(role.name) = LOWER(:roleName)', { roleName })
      .getOne();
    if (!role) {
      // Create role if it doesn't exist
      const newRole = this.roleRepository.create({
        name: roleName,
        description: `${roleName} role`,
      });
      await this.roleRepository.save(newRole);

      const userRole = this.userRoleRepository.create({
        user: savedUser,
        role: newRole,
      });
      await this.userRoleRepository.save(userRole);
    } else {
      const userRole = this.userRoleRepository.create({
        user: savedUser,
        role,
      });
      await this.userRoleRepository.save(userRole);
    }

    // Create company for employer role
    if (roleName === RoleName.EMPLOYER) {
      try {
        const company = this.companyRepository.create({
          name: `Company of ${email.split('@')[0]}`, // Default company name
          email: email, // Use registration email as company email
          ownerId: savedUser.id,
          owner: savedUser,
        });
        await this.companyRepository.save(company);
        console.log(`Company created for employer: ${company.name}`);
      } catch (companyError) {
        console.error('Failed to create company for employer:', companyError);
        // Don't fail registration if company creation fails
      }
    }

    // Reload user with relations to include roles
    const userWithRoles = await this.userRepository.findOne({
      where: { id: savedUser.id },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!userWithRoles) {
      throw new BadRequestException('Failed to create user');
    }

    // Generate tokens
    const tokens = await this.generateTokens(userWithRoles);

    return {
      ...tokens,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user: this.sanitizeUser(userWithRoles),
    };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string; user: any }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user: this.sanitizeUser(user),
    };
  }

  async refreshToken(
    userId: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userRoles', 'userRoles.role'],
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Invalid user');
    }

    return this.generateTokens(user);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  private async generateTokens(
    user: User,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    // Create refresh token with custom expiration
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  private sanitizeUser(user: User): any {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...sanitizedUser } = user;
    return {
      ...sanitizedUser,
      roles: user.userRoles?.map((ur) => ur.role.name) || [],
    };
  }
}

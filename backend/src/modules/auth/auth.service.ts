import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
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

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Store reset token (you might want to add these fields to User entity)
    // For now, we'll use a simple approach with JWT
    const resetPayload = {
      sub: user.id,
      email: user.email,
      type: 'password_reset',
    };

    const resetJwtToken = this.jwtService.sign(resetPayload, {
      expiresIn: '1h',
    });

    // TODO: Send email with reset link
    // In production, you would send an email here
    console.log(`Password reset token for ${email}: ${resetJwtToken}`);
    console.log(`Reset link: http://localhost:3000/auth/reset-password?token=${resetJwtToken}`);

    return {
      message: 'Password reset email has been sent',
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      // Verify the reset token
      const payload = this.jwtService.verify(token) as JwtPayload & { type?: string };

      if (payload.type !== 'password_reset') {
        throw new BadRequestException('Invalid reset token');
      }

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new BadRequestException('Invalid reset token');
      }

      // Update password
      user.password = newPassword; // Will be hashed by BeforeInsert hook
      await this.userRepository.save(user);

      return {
        message: 'Password has been reset successfully',
      };
    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      // Verify the email verification token
      const payload = this.jwtService.verify(token) as JwtPayload & { type?: string };

      if (payload.type !== 'email_verification') {
        throw new BadRequestException('Invalid verification token');
      }

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new BadRequestException('Invalid verification token');
      }

      // Mark email as verified
      user.emailVerifiedAt = new Date();
      await this.userRepository.save(user);

      return {
        message: 'Email has been verified successfully',
      };
    } catch (error) {
      throw new BadRequestException('Invalid or expired verification token');
    }
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    if (user.emailVerifiedAt) {
      throw new BadRequestException('Email is already verified');
    }

    // Generate verification token
    const verificationPayload = {
      sub: user.id,
      email: user.email,
      type: 'email_verification',
    };

    const verificationToken = this.jwtService.sign(verificationPayload, {
      expiresIn: '24h',
    });

    // TODO: Send verification email
    // In production, you would send an email here
    console.log(`Email verification token for ${email}: ${verificationToken}`);
    console.log(`Verification link: http://localhost:3000/auth/verify-email?token=${verificationToken}`);

    return {
      message: 'Verification email has been sent',
    };
  }

  async loginWithGoogle(
    googleUser: any,
  ): Promise<{ access_token: string; refresh_token: string; user: any }> {
    const { email, googleId, firstName, lastName, avatar } = googleUser;

    // Check if user exists with Google ID
    let user = await this.userRepository.findOne({
      where: { googleId },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) {
      // Check if user exists with email
      user = await this.userRepository.findOne({
        where: { email },
        relations: ['userRoles', 'userRoles.role'],
      });

      if (user) {
        // Link Google account to existing user
        user.googleId = googleId;
        if (avatar) user.avatarUrl = avatar;
        await this.userRepository.save(user);
      } else {
        // Create new user with Google account
        user = this.userRepository.create({
          email,
          googleId,
          firstName,
          lastName,
          avatarUrl: avatar,
          status: UserStatus.ACTIVE,
          emailVerifiedAt: new Date(), // Google accounts are pre-verified
        });

        const savedUser = await this.userRepository.save(user);

        // Assign default role (job_seeker)
        const role = await this.roleRepository.findOne({
          where: { name: RoleName.JOB_SEEKER },
        });

        if (role) {
          const userRole = this.userRoleRepository.create({
            user: savedUser,
            role,
          });
          await this.userRoleRepository.save(userRole);
        }

        // Reload user with relations
        user = await this.userRepository.findOne({
          where: { id: savedUser.id },
          relations: ['userRoles', 'userRoles.role'],
        });

        if (!user) {
          throw new BadRequestException('Failed to create user');
        }
      }
    }

    // Update last login
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: this.sanitizeUser(user),
    };
  }
}

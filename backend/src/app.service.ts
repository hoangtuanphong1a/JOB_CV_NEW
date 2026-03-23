import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './modules/common/entities/user.entity';
import { Role, RoleName } from './modules/common/entities/role.entity';
import { UserRole } from './modules/common/entities/user-role.entity';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  async onModuleInit() {
    await this.seedDefaultRoles();
    await this.seedAdminUser();
  }

  private async seedDefaultRoles() {
    try {
      console.log('🌱 Checking default roles...');

      const defaultRoles = [
        {
          name: RoleName.ADMIN,
          description: 'Administrator role with full access',
        },
        {
          name: RoleName.EMPLOYER,
          description: 'Employer role for company accounts',
        },
        {
          name: RoleName.HR,
          description: 'Human Resources role for recruitment management',
        },
        {
          name: RoleName.JOB_SEEKER,
          description: 'Job seeker role for candidates',
        },
      ];

      for (const roleData of defaultRoles) {
        const existingRole = await this.roleRepository.findOne({
          where: { name: roleData.name },
        });

        if (!existingRole) {
          const role = this.roleRepository.create(roleData);
          await this.roleRepository.save(role);
          console.log(`✅ ${roleData.name} role created`);
        } else {
          console.log(`✅ ${roleData.name} role already exists`);
        }
      }

      console.log('🎉 All default roles verified!');
    } catch (error) {
      console.error(
        '❌ Error seeding default roles:',
        (error as Error).message,
      );
    }
  }

  private async seedAdminUser() {
    try {
      console.log('🌱 Checking admin user...');

      // Check if admin role exists, create if not
      let adminRole = await this.roleRepository.findOne({
        where: { name: RoleName.ADMIN },
      });

      if (!adminRole) {
        adminRole = this.roleRepository.create({
          name: RoleName.ADMIN,
          description: 'Administrator role with full access',
        });
        await this.roleRepository.save(adminRole);
        console.log('✅ Admin role created');
      }

      // Check if admin user exists
      const existingAdmin = await this.userRepository.findOne({
        where: { email: 'admin@cvking.com' },
      });

      if (existingAdmin) {
        console.log('✅ Admin user already exists');
        return;
      }

      // Create admin user
      const adminUser = this.userRepository.create({
        email: 'admin@cvking.com',
        password: 'admin123',
        status: UserStatus.ACTIVE,
      });

      const savedUser = await this.userRepository.save(adminUser);

      // Assign admin role
      const userRole = this.userRoleRepository.create({
        user: savedUser,
        role: adminRole,
      });

      await this.userRoleRepository.save(userRole);

      console.log('🎉 Admin user created successfully!');
      console.log('📧 Email: admin@cvking.com');
      console.log('🔑 Password: admin123');
    } catch (error) {
      console.error('❌ Error seeding admin user:', (error as Error).message);
    }
  }

  getHello(): string {
    return 'CVKing API is running!';
  }
}

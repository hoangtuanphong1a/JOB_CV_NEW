import { SetMetadata } from '@nestjs/common';
import { RoleName } from '../entities/role.entity';

export const Roles = (...roles: RoleName[]) => SetMetadata('roles', roles);

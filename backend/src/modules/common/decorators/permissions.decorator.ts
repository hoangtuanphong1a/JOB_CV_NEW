import { SetMetadata } from '@nestjs/common';
import { Permission } from '../entities/role.entity';

export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata('permissions', permissions);

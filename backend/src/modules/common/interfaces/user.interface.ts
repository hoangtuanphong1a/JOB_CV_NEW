import { RoleName } from '../entities/role.entity';

export interface AuthenticatedUser {
  id: string;
  email: string;
  roles: RoleName[];
}

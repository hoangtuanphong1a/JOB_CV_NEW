import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleName, Permission, RolePermissions } from '../entities/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleName[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check roles
    if (requiredRoles) {
      const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
      if (!hasRole) {
        throw new ForbiddenException('Insufficient role permissions');
      }
    }

    // Check permissions
    if (requiredPermissions) {
      const userPermissions = this.getUserPermissions(user.roles);
      const hasPermission = requiredPermissions.every((permission) =>
        userPermissions.includes(permission),
      );
      if (!hasPermission) {
        throw new ForbiddenException('Insufficient permissions');
      }
    }

    return true;
  }

  private getUserPermissions(userRoles: string[]): Permission[] {
    const permissions: Permission[] = [];

    userRoles.forEach((roleName) => {
      const rolePermissions = RolePermissions[roleName as RoleName];
      if (rolePermissions) {
        permissions.push(...rolePermissions);
      }
    });

    // Remove duplicates
    return [...new Set(permissions)];
  }
}

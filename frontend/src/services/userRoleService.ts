import { api } from './api';

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  assignedAt: string;
  assignedBy?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  role?: {
    id: string;
    name: string;
    description?: string;
    permissions: string[];
  };
}

export interface CreateUserRoleData {
  userId: string;
  roleId: string;
}

export interface UpdateUserRoleData {
  userId?: string;
  roleId?: string;
}

export class UserRoleService {
  static async getUserRoles(): Promise<UserRole[]> {
    const response = await api.get('/user-role');
    return response.data;
  }

  static async createUserRole(data: CreateUserRoleData): Promise<UserRole> {
    const response = await api.post('/user-role', data);
    return response.data;
  }

  static async getUserRole(id: string): Promise<UserRole> {
    const response = await api.get(`/user-role/${id}`);
    return response.data;
  }

  static async updateUserRole(id: string, data: UpdateUserRoleData): Promise<UserRole> {
    const response = await api.put(`/user-role/${id}`, data);
    return response.data;
  }

  static async deleteUserRole(id: string): Promise<void> {
    await api.delete(`/user-role/${id}`);
  }

  static async getUserRolesByUser(userId: string): Promise<UserRole[]> {
    const response = await api.get(`/user-role/user/${userId}`);
    return response.data;
  }

  static async getUserRolesByRole(roleId: string): Promise<UserRole[]> {
    const response = await api.get(`/user-role/role/${roleId}`);
    return response.data;
  }

  static async assignRoleToUser(data: CreateUserRoleData): Promise<UserRole> {
    return this.createUserRole(data);
  }

  static async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    const userRoles = await this.getUserRolesByUser(userId);
    const userRole = userRoles.find(ur => ur.roleId === roleId);
    if (userRole) {
      await this.deleteUserRole(userRole.id);
    }
  }

  static async getUserPermissions(userId: string): Promise<string[]> {
    const userRoles = await this.getUserRolesByUser(userId);
    const permissions: string[] = [];

    for (const userRole of userRoles) {
      if (userRole.role) {
        permissions.push(...userRole.role.permissions || []);
      }
    }

    // Remove duplicates
    return [...new Set(permissions)];
  }

  static async checkUserPermission(userId: string, permission: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.includes(permission);
  }
}

export default UserRoleService;

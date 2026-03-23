import { api } from './api';

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  isSystemRole: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleData {
  name: string;
  description?: string;
  permissions: string[];
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  permissions?: string[];
}

export class RoleService {
  static async getRoles(): Promise<Role[]> {
    const response = await api.get('/roles');
    return response.data;
  }

  static async createRole(data: CreateRoleData): Promise<Role> {
    const response = await api.post('/roles', data);
    return response.data;
  }

  static async getRole(id: string): Promise<Role> {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  }

  static async updateRole(id: string, data: UpdateRoleData): Promise<Role> {
    const response = await api.put(`/roles/${id}`, data);
    return response.data;
  }

  static async deleteRole(id: string): Promise<void> {
    await api.delete(`/roles/${id}`);
  }

  static async getRoleByName(roleName: string): Promise<Role> {
    const response = await api.get(`/roles/name/${roleName}`);
    return response.data;
  }

  static async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    await api.post('/user-role', { userId, roleId });
  }

  static async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    await api.delete(`/user-role/${userId}/${roleId}`);
  }
}

export default RoleService;

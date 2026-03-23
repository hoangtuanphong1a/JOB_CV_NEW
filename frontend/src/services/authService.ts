import { api } from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  role: 'job_seeker' | 'employer' | 'hr';
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  status: string;
  roles: string[];
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export class AuthService {
  static async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  }

  static async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data;
  }

  static async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    return response.data;
  }

  static async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put('/auth/profile', data);
    return response.data;
  }

  static async changePassword(data: { oldPassword: string; newPassword: string }): Promise<void> {
    await api.post('/auth/change-password', data);
  }

  static async logout(): Promise<void> {
    await api.post('/auth/logout');
  }

  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  }

  static async verifyEmail(token: string): Promise<void> {
    await api.post('/auth/verify-email', { token });
  }

  static async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/auth/reset-password', { token, newPassword });
  }
}

export default AuthService;

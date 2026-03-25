import { useUserStore } from '@/stores/userStore';

import { LoginSchemaType, RegisterSchemaType } from '@/lib/validations/auth-client';

import { request } from '@/apis/axios'; 
import { KEYS } from './keys';
import { ILoginResponse, ILogoutResponse, IRefreshTokenResponse, IRegisterResponse, IUserResponse } from './types';

export const AuthService = {
  me: async (): Promise<IUserResponse> => {
    const response = await request.get<IUserResponse>(KEYS.AUTH_ME);
    const { setUser } = useUserStore.getState();
    setUser(response.data);

    return response.data;
  },

  login: async (data: LoginSchemaType): Promise<ILoginResponse> => {
    const response = await request.post<ILoginResponse>(KEYS.AUTH_LOGIN, { ...data, username_or_email: data.email });

    return response.data;
  },

  register: async (data: RegisterSchemaType): Promise<IRegisterResponse> => {
    const response = await request.post<IRegisterResponse>(KEYS.AUTH_REGISTER, { ...data, full_name: `${data.firstName} ${data.lastName}` });
    return response.data;
  },

  refreshToken: async (): Promise<IRefreshTokenResponse> => {
    const response = await request.post<IRefreshTokenResponse>(KEYS.AUTH_REFRESH_TOKEN, {});
    const { setTokens } = useUserStore.getState();
    setTokens(response.data);
    return response.data;
  },

  logout: async (): Promise<ILogoutResponse> => {
    const response = await request.post<ILogoutResponse>(KEYS.AUTH_LOGOUT);
    return response.data;
  },
};

import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { LoginSchemaType, RegisterSchemaType } from '@/lib/validations/auth-client';

import { KEYS } from './keys';
import { AuthService } from './requests';
import { ILoginResponse, ILogoutResponse, IRegisterResponse, IUserResponse } from './types';

export const useGetMe = (options: Omit<UseQueryOptions<IUserResponse, Error>, 'queryKey'>) => {
  return useQuery<IUserResponse, Error>({
    queryKey: [KEYS.AUTH_ME],
    queryFn: AuthService.me,
    ...options,
  });
};

export const useLoginMutation = (
  options?: Omit<UseMutationOptions<ILoginResponse, Error, LoginSchemaType>, 'mutationFn'>
) => {
  return useMutation<ILoginResponse, Error, LoginSchemaType>({
    mutationFn: AuthService.login,
    ...options,
  });
};

export const useRegisterMutation = (
  options: Omit<UseMutationOptions<IRegisterResponse, Error, RegisterSchemaType>, 'mutationFn'>
) => {
  return useMutation<IRegisterResponse, Error, RegisterSchemaType>({
    mutationFn: AuthService.register,
    ...options,
  });
};

export const useLogoutMutation = (options?: Omit<UseMutationOptions<ILogoutResponse, Error>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: AuthService.logout,
    ...options,
  });
};

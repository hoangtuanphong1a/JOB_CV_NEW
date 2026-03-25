import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
  useQueryClient,
} from '@tanstack/react-query';

import { NotificationService } from './requests';
import { KEYS } from './keys';
import {
  BaseResponse,
  NotificationListParams,
  NotificationListResponse,
  NotificationResponse,
  UnreadCountResponse,
} from './types';

export const useNotificationsQuery = (
  params?: NotificationListParams,
  userId?: string,
  options?: Omit<UseQueryOptions<NotificationListResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  const serializedParams = params ? JSON.stringify(params) : 'default';
  const { enabled = true, ...restOptions } = options ?? {};
  const queryKey = [KEYS.LIST, userId ?? 'anonymous', serializedParams];

  return useQuery<NotificationListResponse, Error>({
    queryKey,
    queryFn: () => NotificationService.getNotifications(params),
    enabled: !!userId && enabled,
    staleTime: 0,
    refetchOnMount: 'always',
    ...restOptions,
  });
};

export const useUnreadCountQuery = (
  userId?: string,
  options?: Omit<UseQueryOptions<UnreadCountResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  const { enabled = true, ...restOptions } = options ?? {};
  return useQuery<UnreadCountResponse, Error>({
    queryKey: [KEYS.UNREAD_COUNT, userId ?? 'anonymous'],
    queryFn: () => NotificationService.getUnreadCount(),
    enabled: !!userId && enabled,
    refetchOnMount: 'always',
    refetchInterval: 1000 * 15,
    staleTime: 0,
    ...restOptions,
  });
};

export const useMarkNotificationReadMutation = (
  options?: Omit<
    UseMutationOptions<NotificationResponse, Error, string>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();
  const invalidateByKey = (key: string) => {
    queryClient.invalidateQueries({
      predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === key,
    });
  };

  return useMutation<NotificationResponse, Error, string>({
    mutationFn: (id: string) => NotificationService.markAsRead(id),
    onSuccess: (data, variables, context, mutation) => {
      // Invalidate danh sách và số lượng unread sau khi đánh dấu đã đọc
      invalidateByKey(KEYS.LIST);
      invalidateByKey(KEYS.UNREAD_COUNT);

      // Gọi onSuccess từ options (nếu có)
      options?.onSuccess?.(data, variables, context, mutation);
    },
    ...options, // Các options khác (onError, onSettled, ...) được giữ nguyên
  });
};

export const useMarkNotificationUnreadMutation = (
  options?: Omit<
    UseMutationOptions<NotificationResponse, Error, string>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();
  const invalidateByKey = (key: string) => {
    queryClient.invalidateQueries({
      predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === key,
    });
  };

  return useMutation<NotificationResponse, Error, string>({
    mutationFn: (id: string) => NotificationService.markAsUnread(id),
    onSuccess: (data, variables, context, mutation) => {
      invalidateByKey(KEYS.LIST);
      invalidateByKey(KEYS.UNREAD_COUNT);
      options?.onSuccess?.(data, variables, context, mutation);
    },
    ...options,
  });
};

export const useMarkAllNotificationsReadMutation = (
  options?: Omit<
    UseMutationOptions<BaseResponse, Error, void>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();
  const invalidateByKey = (key: string) => {
    queryClient.invalidateQueries({
      predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === key,
    });
  };

  return useMutation<BaseResponse, Error, void>({
    mutationFn: () => NotificationService.markAllAsRead(),
    onSuccess: (data, variables, context, mutation) => {
      invalidateByKey(KEYS.LIST);
      invalidateByKey(KEYS.UNREAD_COUNT);
      options?.onSuccess?.(data, variables, context, mutation);
    },
    ...options,
  });
};
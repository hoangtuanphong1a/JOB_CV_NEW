'use client';

import { useEffect, useMemo } from 'react';
import { useGetMe } from '@/apis/client/auth';
import { useUserStore } from '@/stores';

export const useMe = () => {
  const { user, setUser } = useUserStore();
  const { data: me, isSuccess, isLoading, error, isError } = useGetMe({});

  useEffect(() => {
    if (!isSuccess) return;
    setUser(me);
  }, [isSuccess, me, setUser]);

  const isAuthenticated = useMemo(() => !isLoading && !!user, [isLoading, user]);

  return {
    user,
    error,
    isLoading,
    isError,
    isAuthenticated,
    isReady: !isLoading && !!user,
  };
};

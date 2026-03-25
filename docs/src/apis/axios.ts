/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios from 'axios';
import { useUserStore } from '@/stores/userStore';
import { AuthService } from './client/auth/requests';
import { envConfig } from '@/lib/const';

const request = Axios.create({
  baseURL: envConfig.API_URL,
  withCredentials: true, // quan trọng nếu dùng cookie
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

request.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return request(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { access_token } = await AuthService.refreshToken();
        // const { accessToken } = useUserStore.getState();
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        processQueue(null, access_token);
        return request(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useUserStore.getState().clearUser();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Tự động thêm token vào header
request.interceptors.request.use((config) => {
  const { accessToken, tokenType } = useUserStore.getState();
  if (accessToken) {
    config.headers['Authorization'] = `${tokenType} ${accessToken}`;
  }
  return config;
});

export { request };
// Axios instance with interceptors for API communication

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL, APP_CONFIG } from '@/constants/config';
import { ApiError } from '@/types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: APP_CONFIG.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync(
        APP_CONFIG.storageKeys.authToken
      );
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // SecureStore might not be available in some environments
      console.warn('Could not access secure storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and normalize responses
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; error?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - Token might be expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const refreshToken = await SecureStore.getItemAsync(
          APP_CONFIG.storageKeys.refreshToken
        );

        if (refreshToken) {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          // Store new tokens
          await SecureStore.setItemAsync(
            APP_CONFIG.storageKeys.authToken,
            data.token
          );
          if (data.refreshToken) {
            await SecureStore.setItemAsync(
              APP_CONFIG.storageKeys.refreshToken,
              data.refreshToken
            );
          }

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens and let auth store handle redirect
        await SecureStore.deleteItemAsync(APP_CONFIG.storageKeys.authToken);
        await SecureStore.deleteItemAsync(APP_CONFIG.storageKeys.refreshToken);

        // Return a normalized error
        const normalizedError: ApiError = {
          message: 'Session expired. Please log in again.',
          status: 401,
          code: 'SESSION_EXPIRED',
        };
        return Promise.reject(normalizedError);
      }
    }

    // Normalize error response
    const normalizedError: ApiError = {
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'An unexpected error occurred',
      status: error.response?.status,
      code: error.code,
    };

    // Log error in development
    if (__DEV__) {
      console.error('API Error:', {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status: error.response?.status,
        message: normalizedError.message,
      });
    }

    return Promise.reject(normalizedError);
  }
);

export default api;

// Helper function to check if error is an API error
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ApiError).message === 'string'
  );
}

// Helper function to get error message
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

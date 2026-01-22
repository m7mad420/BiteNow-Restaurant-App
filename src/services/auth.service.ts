// Authentication service
// Uses mock data for development - replace with real API calls in production

import api from './api';
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from '@/types';
import { mockUsers } from '@/constants/mockData';

// Simulated delay for mock API
const mockDelay = () => new Promise((resolve) => setTimeout(resolve, 800));

/**
 * Login user with email and password
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  // TODO: Replace with real API call
  // return api.post('/auth/login', credentials).then(res => res.data);

  // Mock implementation
  await mockDelay();

  const { email, password } = credentials;

  // Check customer credentials
  if (
    email === mockUsers.customer.email &&
    password === mockUsers.customer.password
  ) {
    const { password: _, ...user } = mockUsers.customer;
    return {
      user: user as User,
      token: 'mock_customer_token_' + Date.now(),
      refreshToken: 'mock_customer_refresh_' + Date.now(),
    };
  }

  // Check admin credentials
  if (
    email === mockUsers.admin.email &&
    password === mockUsers.admin.password
  ) {
    const { password: _, ...user } = mockUsers.admin;
    return {
      user: user as User,
      token: 'mock_admin_token_' + Date.now(),
      refreshToken: 'mock_admin_refresh_' + Date.now(),
    };
  }

  // Invalid credentials
  throw {
    message: 'Invalid email or password',
    status: 401,
    code: 'INVALID_CREDENTIALS',
  };
}

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  // TODO: Replace with real API call
  // return api.post('/auth/register', data).then(res => res.data);

  // Mock implementation
  await mockDelay();

  // Check if email already exists
  if (
    data.email === mockUsers.customer.email ||
    data.email === mockUsers.admin.email
  ) {
    throw {
      message: 'An account with this email already exists',
      status: 400,
      code: 'EMAIL_EXISTS',
    };
  }

  // Create new user (always as customer)
  const newUser: User = {
    id: 'usr_' + Date.now(),
    email: data.email,
    name: data.name,
    role: 'customer',
    phone: data.phone,
    createdAt: new Date().toISOString(),
  };

  return {
    user: newUser,
    token: 'mock_token_' + Date.now(),
    refreshToken: 'mock_refresh_' + Date.now(),
  };
}

/**
 * Refresh auth token
 */
export async function refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
  // TODO: Replace with real API call
  // return api.post('/auth/refresh', { refreshToken }).then(res => res.data);

  // Mock implementation
  await mockDelay();

  return {
    token: 'mock_refreshed_token_' + Date.now(),
    refreshToken: 'mock_new_refresh_' + Date.now(),
  };
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<User> {
  // TODO: Replace with real API call
  // return api.get('/auth/me').then(res => res.data);

  // Mock implementation - return customer for now
  await mockDelay();
  const { password: _, ...user } = mockUsers.customer;
  return user as User;
}

/**
 * Logout (invalidate token on server)
 */
export async function logout(): Promise<void> {
  // TODO: Replace with real API call
  // return api.post('/auth/logout');

  // Mock implementation - nothing to do
  await mockDelay();
}

export default {
  login,
  register,
  refreshToken,
  getCurrentUser,
  logout,
};

// Authentication store using Zustand
// Manages user auth state, token storage, and role-based access

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginCredentials, RegisterData, UserRole } from '@/types';
import { authService } from '@/services';
import { APP_CONFIG } from '@/constants/config';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Computed
  isAuthenticated: boolean;
  role: UserRole | null;
  isAdmin: boolean;
  isCustomer: boolean;

  // Actions
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (data: RegisterData) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

// Custom storage adapter for expo-secure-store
// Note: SecureStore has limitations, so we use a hybrid approach
const secureStorageAdapter = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      // Try SecureStore first for token
      if (name === 'auth-storage') {
        const token = await SecureStore.getItemAsync(
          APP_CONFIG.storageKeys.authToken
        );
        if (token) {
          // If we have a token, try to get full state from AsyncStorage
          const state = await AsyncStorage.getItem(name);
          return state;
        }
      }
      return await AsyncStorage.getItem(name);
    } catch (error) {
      console.warn('Error reading from storage:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      // Parse to extract token for secure storage
      const parsed = JSON.parse(value);
      if (parsed?.state?.token) {
        await SecureStore.setItemAsync(
          APP_CONFIG.storageKeys.authToken,
          parsed.state.token
        );
      }
      // Store full state in AsyncStorage (excluding sensitive data if needed)
      await AsyncStorage.setItem(name, value);
    } catch (error) {
      console.warn('Error writing to storage:', error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(APP_CONFIG.storageKeys.authToken);
      await SecureStore.deleteItemAsync(APP_CONFIG.storageKeys.refreshToken);
      await AsyncStorage.removeItem(name);
    } catch (error) {
      console.warn('Error removing from storage:', error);
    }
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isLoading: false,
      isInitialized: false,

      // Computed getters (updated when state changes)
      get isAuthenticated() {
        return !!get().token && !!get().user;
      },
      get role() {
        return get().user?.role ?? null;
      },
      get isAdmin() {
        return get().user?.role === 'admin';
      },
      get isCustomer() {
        return get().user?.role === 'customer';
      },

      // Initialize auth state from storage
      initialize: async () => {
        try {
          set({ isLoading: true });

          // Check for stored token
          const token = await SecureStore.getItemAsync(
            APP_CONFIG.storageKeys.authToken
          );

          if (token) {
            // Token exists, try to get user info
            try {
              const user = await authService.getCurrentUser();
              set({ user, token, isInitialized: true, isLoading: false });
            } catch (error) {
              // Token invalid, clear it
              await SecureStore.deleteItemAsync(APP_CONFIG.storageKeys.authToken);
              set({ user: null, token: null, isInitialized: true, isLoading: false });
            }
          } else {
            set({ isInitialized: true, isLoading: false });
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          set({ isInitialized: true, isLoading: false });
        }
      },

      // Sign in
      signIn: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(credentials);

          // Store tokens securely
          await SecureStore.setItemAsync(
            APP_CONFIG.storageKeys.authToken,
            response.token
          );
          await SecureStore.setItemAsync(
            APP_CONFIG.storageKeys.refreshToken,
            response.refreshToken
          );

          set({
            user: response.user,
            token: response.token,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Sign up
      signUp: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          const response = await authService.register(data);

          // Store tokens securely
          await SecureStore.setItemAsync(
            APP_CONFIG.storageKeys.authToken,
            response.token
          );
          await SecureStore.setItemAsync(
            APP_CONFIG.storageKeys.refreshToken,
            response.refreshToken
          );

          set({
            user: response.user,
            token: response.token,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Sign out
      signOut: async () => {
        set({ isLoading: true });
        try {
          // Call logout API (optional - invalidate token on server)
          await authService.logout().catch(() => {});

          // Clear secure storage
          await SecureStore.deleteItemAsync(APP_CONFIG.storageKeys.authToken);
          await SecureStore.deleteItemAsync(APP_CONFIG.storageKeys.refreshToken);

          set({
            user: null,
            token: null,
            isLoading: false,
          });
        } catch (error) {
          // Even if logout fails, clear local state
          set({
            user: null,
            token: null,
            isLoading: false,
          });
        }
      },

      // Update user profile
      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorageAdapter),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);

// Selectors for easier access
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsAdmin = (state: AuthState) => state.isAdmin;
export const selectIsCustomer = (state: AuthState) => state.isCustomer;
export const selectRole = (state: AuthState) => state.role;

export default useAuthStore;

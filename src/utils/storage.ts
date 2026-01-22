// AsyncStorage helper utilities

import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '@/constants/config';

/**
 * Generic storage helper for JSON data
 */
export const storage = {
  /**
   * Get an item from storage
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error reading ${key} from storage:`, error);
      return null;
    }
  },

  /**
   * Set an item in storage
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to storage:`, error);
    }
  },

  /**
   * Remove an item from storage
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  },

  /**
   * Clear all app storage
   */
  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter((key) => key.startsWith('bitenow_'));
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

/**
 * Onboarding storage helpers
 */
export const onboardingStorage = {
  async hasCompleted(): Promise<boolean> {
    const value = await AsyncStorage.getItem(
      APP_CONFIG.storageKeys.onboardingComplete
    );
    return value === 'true';
  },

  async markCompleted(): Promise<void> {
    await AsyncStorage.setItem(
      APP_CONFIG.storageKeys.onboardingComplete,
      'true'
    );
  },

  async reset(): Promise<void> {
    await AsyncStorage.removeItem(APP_CONFIG.storageKeys.onboardingComplete);
  },
};

/**
 * User preferences storage
 */
export interface UserPreferences {
  defaultAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    instructions?: string;
  };
  defaultPaymentMethod?: string;
  notifications?: boolean;
}

export const preferencesStorage = {
  async get(): Promise<UserPreferences | null> {
    return storage.get<UserPreferences>(APP_CONFIG.storageKeys.userPreferences);
  },

  async set(preferences: UserPreferences): Promise<void> {
    return storage.set(APP_CONFIG.storageKeys.userPreferences, preferences);
  },

  async update(updates: Partial<UserPreferences>): Promise<void> {
    const current = await this.get();
    await this.set({ ...current, ...updates });
  },

  async clear(): Promise<void> {
    return storage.remove(APP_CONFIG.storageKeys.userPreferences);
  },
};

export default storage;

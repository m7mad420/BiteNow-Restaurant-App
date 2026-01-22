// Onboarding store using Zustand
// Manages first-launch onboarding state

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '@/constants/config';

interface OnboardingState {
  // State
  hasCompletedOnboarding: boolean;
  isLoading: boolean;

  // Actions
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  checkOnboardingStatus: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      // Initial state
      hasCompletedOnboarding: false,
      isLoading: true,

      // Mark onboarding as complete
      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },

      // Reset onboarding (for testing)
      resetOnboarding: () => {
        set({ hasCompletedOnboarding: false });
      },

      // Check onboarding status on app launch
      checkOnboardingStatus: async () => {
        try {
          const value = await AsyncStorage.getItem(
            APP_CONFIG.storageKeys.onboardingComplete
          );
          set({
            hasCompletedOnboarding: value === 'true',
            isLoading: false,
          });
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: APP_CONFIG.storageKeys.onboardingComplete,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
      onRehydrateStorage: () => (state) => {
        // Called when store is rehydrated from storage
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);

// Selectors
export const selectHasCompletedOnboarding = (state: OnboardingState) =>
  state.hasCompletedOnboarding;
export const selectIsOnboardingLoading = (state: OnboardingState) =>
  state.isLoading;

export default useOnboardingStore;

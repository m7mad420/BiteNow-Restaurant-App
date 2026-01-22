// Root Navigation
// Handles auth state and role-based navigation

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useAuthStore, useOnboardingStore } from '@/stores';
import { LoadingScreen } from '@/components/ui';
import { colors } from '@/constants/theme';

// Navigators
import AuthNavigator from './AuthNavigator';
import CustomerNavigator from './CustomerNavigator';
import AdminNavigator from './AdminNavigator';

// Screens
import OnboardingScreen from '@/screens/OnboardingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isInitialized, isLoading: authLoading, token, user, initialize } = useAuthStore();
  const { hasCompletedOnboarding, isLoading: onboardingLoading } = useOnboardingStore();

  // Initialize auth state on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show loading screen while initializing
  if (!isInitialized || authLoading || onboardingLoading) {
    return <LoadingScreen message="Starting BiteNow..." />;
  }

  // Determine which flow to show
  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        {/* Show onboarding if not completed */}
        {!hasCompletedOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : !isAuthenticated ? (
          // Show auth screens if not logged in
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : isAdmin ? (
          // Show admin screens for admin role
          <Stack.Screen name="AdminMain" component={AdminNavigator} />
        ) : (
          // Show customer screens for customer role (default)
          <Stack.Screen name="CustomerMain" component={CustomerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;

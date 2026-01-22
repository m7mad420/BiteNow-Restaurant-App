// Navigation type definitions
// Provides type-safe navigation throughout the app

import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// ============================================================================
// Root Stack (handles auth state and role-based navigation)
// ============================================================================
export type RootStackParamList = {
  Onboarding: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  CustomerMain: NavigatorScreenParams<CustomerTabParamList>;
  AdminMain: NavigatorScreenParams<AdminTabParamList>;
};

// ============================================================================
// Auth Stack
// ============================================================================
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// ============================================================================
// Customer Tab Navigator
// ============================================================================
export type CustomerTabParamList = {
  Home: undefined;
  Orders: undefined;
  Profile: undefined;
};

// ============================================================================
// Customer Stack (nested in Home tab)
// ============================================================================
export type CustomerStackParamList = {
  RestaurantList: undefined;
  RestaurantDetail: { restaurantId: string };
  Menu: { restaurantId: string; restaurantName: string };
  Cart: undefined;
  Checkout: undefined;
  OrderSuccess: { orderId: string };
  OrderDetail: { orderId: string };
};

// ============================================================================
// Admin Tab Navigator
// ============================================================================
export type AdminTabParamList = {
  AdminOrders: undefined;
  AdminMenu: undefined;
  AdminProfile: undefined;
};

// ============================================================================
// Admin Stack (nested in AdminOrders tab)
// ============================================================================
export type AdminStackParamList = {
  OrdersList: undefined;
  OrderDetail: { orderId: string };
};

// ============================================================================
// Screen Props Types
// ============================================================================

// Root Stack
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// Auth Stack
export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

// Customer Tab
export type CustomerTabScreenProps<T extends keyof CustomerTabParamList> =
  BottomTabScreenProps<CustomerTabParamList, T>;

// Customer Stack
export type CustomerStackScreenProps<T extends keyof CustomerStackParamList> =
  NativeStackScreenProps<CustomerStackParamList, T>;

// Admin Tab
export type AdminTabScreenProps<T extends keyof AdminTabParamList> =
  BottomTabScreenProps<AdminTabParamList, T>;

// Admin Stack
export type AdminStackScreenProps<T extends keyof AdminStackParamList> =
  NativeStackScreenProps<AdminStackParamList, T>;

// ============================================================================
// Declare global navigation types for useNavigation hook
// ============================================================================
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

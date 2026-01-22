// Admin Navigator
// Bottom tabs for admin/restaurant role

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';
import { AdminTabParamList, AdminStackParamList } from './types';
import { colors } from '@/constants/theme';

// Screens
import AdminOrdersScreen from '@/screens/admin/AdminOrdersScreen';
import AdminMenuScreen from '@/screens/admin/AdminMenuScreen';
import AdminProfileScreen from '@/screens/admin/AdminProfileScreen';
import OrderDetailScreen from '@/screens/shared/OrderDetailScreen';

const Tab = createBottomTabNavigator<AdminTabParamList>();
const Stack = createNativeStackNavigator<AdminStackParamList>();

// Orders Stack (with order detail)
function AdminOrdersStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="OrdersList"
        component={AdminOrdersScreen}
        options={{ title: 'Incoming Orders' }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ title: 'Order Details' }}
      />
    </Stack.Navigator>
  );
}

export function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.divider,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="AdminOrders"
        component={AdminOrdersStack}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <Icon source="clipboard-list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminMenu"
        component={AdminMenuScreen}
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: ({ color, size }) => (
            <Icon source="food" size={size} color={color} />
          ),
          headerShown: true,
          headerTitle: 'Menu Management',
          headerStyle: { backgroundColor: colors.surface },
        }}
      />
      <Tab.Screen
        name="AdminProfile"
        component={AdminProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon source="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default AdminNavigator;

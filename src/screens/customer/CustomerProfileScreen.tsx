// Customer Profile Screen
// User profile with logout option

import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Avatar, List, Divider, Button, Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

export function CustomerProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const isLoading = useAuthStore((state) => state.isLoading);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.profileCard}>
          <Avatar.Text
            size={80}
            label={user ? getInitials(user.name) : '?'}
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
          />
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {user?.phone && <Text style={styles.userPhone}>{user.phone}</Text>}
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          <List.Item
            title="Edit Profile"
            description="Update your personal information"
            left={(props) => <List.Icon {...props} icon="account-edit" color={colors.primary} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              Alert.alert('Coming Soon', 'This feature is not yet available.');
            }}
            style={styles.menuItem}
          />
          <Divider />
          <List.Item
            title="Delivery Addresses"
            description="Manage your saved addresses"
            left={(props) => <List.Icon {...props} icon="map-marker" color={colors.primary} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              Alert.alert('Coming Soon', 'This feature is not yet available.');
            }}
            style={styles.menuItem}
          />
          <Divider />
          <List.Item
            title="Payment Methods"
            description="Manage your payment options"
            left={(props) => <List.Icon {...props} icon="credit-card" color={colors.primary} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              Alert.alert('Coming Soon', 'This feature is not yet available.');
            }}
            style={styles.menuItem}
          />
          <Divider />
          <List.Item
            title="Notifications"
            description="Configure notification preferences"
            left={(props) => <List.Icon {...props} icon="bell" color={colors.primary} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              Alert.alert('Coming Soon', 'This feature is not yet available.');
            }}
            style={styles.menuItem}
          />
        </View>

        {/* Support Section */}
        <View style={styles.menuCard}>
          <List.Item
            title="Help & Support"
            description="Get help with your orders"
            left={(props) => <List.Icon {...props} icon="help-circle" color={colors.textSecondary} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              Alert.alert('Contact Support', 'Email: support@bitenow.com\nPhone: 1-800-BITENOW');
            }}
            style={styles.menuItem}
          />
          <Divider />
          <List.Item
            title="About BiteNow"
            description="App version 1.0.0"
            left={(props) => <List.Icon {...props} icon="information" color={colors.textSecondary} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              Alert.alert('BiteNow', 'Version 1.0.0\n\nBuilt with ❤️ for food lovers');
            }}
            style={styles.menuItem}
          />
        </View>

        {/* Logout Button */}
        <Button
          mode="outlined"
          onPress={handleLogout}
          loading={isLoading}
          disabled={isLoading}
          style={styles.logoutButton}
          contentStyle={styles.logoutButtonContent}
          labelStyle={styles.logoutButtonLabel}
          icon="logout"
        >
          Logout
        </Button>

        {/* Demo Note */}
        <Text style={styles.demoNote}>
          This is a demo app. All data is simulated.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  profileCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingVertical: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.small,
  },
  avatar: {
    backgroundColor: colors.primary,
    marginBottom: spacing.md,
  },
  avatarLabel: {
    fontSize: 28,
    fontWeight: '600',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  userPhone: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.small,
  },
  menuItem: {
    paddingVertical: spacing.sm,
  },
  logoutButton: {
    marginHorizontal: spacing.md,
    marginTop: spacing.xl,
    borderColor: colors.error,
    borderRadius: borderRadius.lg,
  },
  logoutButtonContent: {
    paddingVertical: spacing.sm,
  },
  logoutButtonLabel: {
    color: colors.error,
    fontSize: 16,
  },
  demoNote: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
});

export default CustomerProfileScreen;

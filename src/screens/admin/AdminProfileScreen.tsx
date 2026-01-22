// Admin Profile Screen
// Admin profile with logout option

import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Avatar, List, Divider, Button, Icon, Badge } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

export function AdminProfileScreen() {
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
          <Text style={styles.title}>Admin Profile</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Avatar.Text
              size={80}
              label={user ? getInitials(user.name) : '?'}
              style={styles.avatar}
              labelStyle={styles.avatarLabel}
            />
            <Badge style={styles.adminBadge}>Admin</Badge>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Icon source="receipt" size={28} color={colors.primary} />
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Icon source="currency-usd" size={28} color={colors.success} />
            <Text style={styles.statValue}>$4,832</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Icon source="star" size={28} color={colors.star} />
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          <List.Item
            title="Restaurant Settings"
            description="Update restaurant information"
            left={(props) => <List.Icon {...props} icon="store" color={colors.primary} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              Alert.alert('Coming Soon', 'This feature is not yet available.');
            }}
            style={styles.menuItem}
          />
          <Divider />
          <List.Item
            title="Opening Hours"
            description="Manage business hours"
            left={(props) => <List.Icon {...props} icon="clock-outline" color={colors.primary} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              Alert.alert('Coming Soon', 'This feature is not yet available.');
            }}
            style={styles.menuItem}
          />
          <Divider />
          <List.Item
            title="Delivery Settings"
            description="Configure delivery zones and fees"
            left={(props) => <List.Icon {...props} icon="bike-fast" color={colors.primary} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              Alert.alert('Coming Soon', 'This feature is not yet available.');
            }}
            style={styles.menuItem}
          />
          <Divider />
          <List.Item
            title="Analytics"
            description="View sales and performance data"
            left={(props) => <List.Icon {...props} icon="chart-line" color={colors.primary} />}
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
            description="Get help with admin features"
            left={(props) => <List.Icon {...props} icon="help-circle" color={colors.textSecondary} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              Alert.alert('Contact Support', 'Email: admin@bitenow.com\nPhone: 1-800-BITENOW');
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
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    backgroundColor: colors.secondary,
  },
  avatarLabel: {
    fontSize: 28,
    fontWeight: '600',
  },
  adminBadge: {
    position: 'absolute',
    bottom: 0,
    right: -8,
    backgroundColor: colors.primary,
    fontSize: 10,
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
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.divider,
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

export default AdminProfileScreen;

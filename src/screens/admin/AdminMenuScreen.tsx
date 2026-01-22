// Admin Menu Screen
// Placeholder for menu management

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Icon, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '@/constants/theme';

export function AdminMenuScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu Management</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon source="food-fork-drink" size={80} color={colors.textSecondary} />
        </View>
        
        <Text style={styles.comingSoonTitle}>Coming Soon</Text>
        <Text style={styles.comingSoonText}>
          Menu management features are under development. You'll be able to:
        </Text>

        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Icon source="check-circle" size={20} color={colors.success} />
            <Text style={styles.featureText}>Add and edit menu items</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon source="check-circle" size={20} color={colors.success} />
            <Text style={styles.featureText}>Manage categories</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon source="check-circle" size={20} color={colors.success} />
            <Text style={styles.featureText}>Update prices and availability</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon source="check-circle" size={20} color={colors.success} />
            <Text style={styles.featureText}>Upload item photos</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon source="check-circle" size={20} color={colors.success} />
            <Text style={styles.featureText}>Set daily specials</Text>
          </View>
        </View>

        <Button
          mode="outlined"
          style={styles.notifyButton}
          onPress={() => {}}
        >
          Notify Me When Ready
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: colors.surfaceVariant,
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  comingSoonText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  featureList: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  featureText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  notifyButton: {
    borderRadius: borderRadius.lg,
    borderColor: colors.primary,
  },
});

export default AdminMenuScreen;

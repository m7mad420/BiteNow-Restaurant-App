// Order card component
// Displays order summary in lists

import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { OrderListItem } from '@/types';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';
import { formatPrice, formatDateTime, formatItemCount } from '@/utils/formatters';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderCardProps {
  order: OrderListItem;
  onPress: () => void;
}

export function OrderCard({ order, onPress }: OrderCardProps) {
  const { restaurantName, restaurantImage, status, total, itemCount, createdAt } = order;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Restaurant Image */}
      {restaurantImage ? (
        <Image source={{ uri: restaurantImage }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholderImage]} />
      )}

      {/* Order Info */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {restaurantName}
          </Text>
          <OrderStatusBadge status={status} size="small" />
        </View>

        <Text style={styles.itemCount}>{formatItemCount(itemCount)}</Text>

        <View style={styles.footerRow}>
          <Text style={styles.total}>{formatPrice(total)}</Text>
          <Text style={styles.date}>{formatDateTime(createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    backgroundColor: colors.skeleton,
  },
  placeholderImage: {
    backgroundColor: colors.surfaceVariant,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  restaurantName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  itemCount: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  total: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default OrderCard;

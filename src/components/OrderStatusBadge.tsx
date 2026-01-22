// Order status badge component
// Displays order status with appropriate color and icon

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Icon } from 'react-native-paper';
import { OrderStatus } from '@/types';
import { ORDER_STATUS_CONFIG } from '@/constants/config';
import { borderRadius, spacing } from '@/constants/theme';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
}

export function OrderStatusBadge({
  status,
  size = 'medium',
  showIcon = true,
}: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status];

  const sizeStyles = {
    small: {
      container: styles.containerSmall,
      text: styles.textSmall,
      iconSize: 12,
    },
    medium: {
      container: styles.containerMedium,
      text: styles.textMedium,
      iconSize: 14,
    },
    large: {
      container: styles.containerLarge,
      text: styles.textLarge,
      iconSize: 18,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View
      style={[
        styles.container,
        currentSize.container,
        { backgroundColor: `${config.color}15` }, // 15 = ~9% opacity in hex
      ]}
    >
      {showIcon && (
        <Icon
          source={config.icon}
          size={currentSize.iconSize}
          color={config.color}
        />
      )}
      <Text style={[styles.text, currentSize.text, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
}

// Expanded status display with description (for order details)
interface OrderStatusExpandedProps {
  status: OrderStatus;
}

export function OrderStatusExpanded({ status }: OrderStatusExpandedProps) {
  const config = ORDER_STATUS_CONFIG[status];

  return (
    <View style={styles.expandedContainer}>
      <View
        style={[
          styles.expandedIconContainer,
          { backgroundColor: `${config.color}15` },
        ]}
      >
        <Icon source={config.icon} size={32} color={config.color} />
      </View>
      <View style={styles.expandedContent}>
        <Text style={[styles.expandedLabel, { color: config.color }]}>
          {config.label}
        </Text>
        <Text style={styles.expandedDescription}>{config.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Badge styles
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
  },
  text: {
    fontWeight: '600',
  },

  // Size variants
  containerSmall: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    gap: 4,
  },
  textSmall: {
    fontSize: 10,
  },

  containerMedium: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    gap: 4,
  },
  textMedium: {
    fontSize: 12,
  },

  containerLarge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 6,
  },
  textLarge: {
    fontSize: 14,
  },

  // Expanded variant styles
  expandedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  expandedIconContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  expandedLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  expandedDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default OrderStatusBadge;

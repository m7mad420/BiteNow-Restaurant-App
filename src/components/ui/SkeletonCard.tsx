// Skeleton card component for loading placeholders

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, spacing, borderRadius } from '@/constants/theme';

interface SkeletonCardProps {
  variant?: 'restaurant' | 'menuItem' | 'order';
}

export function SkeletonCard({ variant = 'restaurant' }: SkeletonCardProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  if (variant === 'menuItem') {
    return (
      <View style={styles.menuItemContainer}>
        <View style={styles.menuItemContent}>
          <Animated.View style={[styles.menuItemTitle, { opacity }]} />
          <Animated.View style={[styles.menuItemDesc, { opacity }]} />
          <Animated.View style={[styles.menuItemPrice, { opacity }]} />
        </View>
        <Animated.View style={[styles.menuItemImage, { opacity }]} />
      </View>
    );
  }

  if (variant === 'order') {
    return (
      <View style={styles.orderContainer}>
        <View style={styles.orderHeader}>
          <Animated.View style={[styles.orderImage, { opacity }]} />
          <View style={styles.orderInfo}>
            <Animated.View style={[styles.orderTitle, { opacity }]} />
            <Animated.View style={[styles.orderSubtitle, { opacity }]} />
          </View>
          <Animated.View style={[styles.orderBadge, { opacity }]} />
        </View>
        <Animated.View style={[styles.orderFooter, { opacity }]} />
      </View>
    );
  }

  // Restaurant card (default)
  return (
    <View style={styles.restaurantContainer}>
      <Animated.View style={[styles.restaurantImage, { opacity }]} />
      <View style={styles.restaurantContent}>
        <Animated.View style={[styles.restaurantTitle, { opacity }]} />
        <Animated.View style={[styles.restaurantSubtitle, { opacity }]} />
        <View style={styles.restaurantFooter}>
          <Animated.View style={[styles.restaurantTag, { opacity }]} />
          <Animated.View style={[styles.restaurantTag, { opacity }]} />
          <Animated.View style={[styles.restaurantTag, { opacity }]} />
        </View>
      </View>
    </View>
  );
}

// Skeleton list component
interface SkeletonListProps {
  count?: number;
  variant?: 'restaurant' | 'menuItem' | 'order';
}

export function SkeletonList({ count = 3, variant = 'restaurant' }: SkeletonListProps) {
  return (
    <View style={styles.listContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} variant={variant} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: spacing.md,
  },

  // Restaurant skeleton
  restaurantContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  restaurantImage: {
    height: 150,
    backgroundColor: colors.skeleton,
  },
  restaurantContent: {
    padding: spacing.md,
  },
  restaurantTitle: {
    height: 20,
    width: '60%',
    backgroundColor: colors.skeleton,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  restaurantSubtitle: {
    height: 14,
    width: '80%',
    backgroundColor: colors.skeleton,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  restaurantFooter: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  restaurantTag: {
    height: 24,
    width: 60,
    backgroundColor: colors.skeleton,
    borderRadius: borderRadius.full,
  },

  // Menu item skeleton
  menuItemContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuItemContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  menuItemTitle: {
    height: 18,
    width: '70%',
    backgroundColor: colors.skeleton,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  menuItemDesc: {
    height: 14,
    width: '90%',
    backgroundColor: colors.skeleton,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  menuItemPrice: {
    height: 16,
    width: 50,
    backgroundColor: colors.skeleton,
    borderRadius: borderRadius.sm,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    backgroundColor: colors.skeleton,
    borderRadius: borderRadius.md,
  },

  // Order skeleton
  orderContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderImage: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    backgroundColor: colors.skeleton,
  },
  orderInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  orderTitle: {
    height: 16,
    width: '60%',
    backgroundColor: colors.skeleton,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  orderSubtitle: {
    height: 14,
    width: '40%',
    backgroundColor: colors.skeleton,
    borderRadius: borderRadius.sm,
  },
  orderBadge: {
    height: 24,
    width: 70,
    backgroundColor: colors.skeleton,
    borderRadius: borderRadius.full,
  },
  orderFooter: {
    height: 14,
    width: '50%',
    backgroundColor: colors.skeleton,
    borderRadius: borderRadius.sm,
    marginTop: spacing.md,
  },
});

export default SkeletonCard;

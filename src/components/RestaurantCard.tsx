// Restaurant card component
// Displays restaurant info in a card format for lists

import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Icon, Chip } from 'react-native-paper';
import { Restaurant } from '@/types';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';
import { formatPrice } from '@/utils/formatters';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
}

export function RestaurantCard({ restaurant, onPress }: RestaurantCardProps) {
  const {
    name,
    description,
    image,
    cuisine,
    rating,
    reviewCount,
    deliveryTime,
    deliveryFee,
    isOpen,
  } = restaurant;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Restaurant Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
        {!isOpen && (
          <View style={styles.closedOverlay}>
            <Text style={styles.closedText}>Currently Closed</Text>
          </View>
        )}
        {/* Delivery fee badge */}
        <View style={styles.deliveryBadge}>
          <Text style={styles.deliveryBadgeText}>
            {deliveryFee === 0 ? 'Free Delivery' : `${formatPrice(deliveryFee)} delivery`}
          </Text>
        </View>
      </View>

      {/* Restaurant Info */}
      <View style={styles.content}>
        {/* Header row: Name and rating */}
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <View style={styles.ratingContainer}>
            <Icon source="star" size={16} color={colors.star} />
            <Text style={styles.rating}>{rating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({reviewCount})</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        {/* Footer row: Cuisine tags and delivery time */}
        <View style={styles.footerRow}>
          <View style={styles.cuisineTags}>
            {cuisine.slice(0, 2).map((c, index) => (
              <Chip
                key={index}
                style={styles.cuisineChip}
                textStyle={styles.cuisineChipText}
                compact
              >
                {c}
              </Chip>
            ))}
          </View>
          <View style={styles.deliveryTime}>
            <Icon source="clock-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.deliveryTimeText}>{deliveryTime}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.medium,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: colors.skeleton,
  },
  closedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closedText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  deliveryBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  deliveryBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cuisineTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    gap: spacing.xs,
    marginRight: spacing.sm,
  },
  cuisineChip: {
    backgroundColor: colors.surfaceVariant,
    paddingVertical: 2,
  },
  cuisineChipText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  deliveryTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryTimeText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});

export default RestaurantCard;

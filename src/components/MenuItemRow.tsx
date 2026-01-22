// Menu item row component
// Displays a single menu item with add to cart functionality

import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, IconButton, Badge } from 'react-native-paper';
import { MenuItem } from '@/types';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { formatPrice } from '@/utils/formatters';

interface MenuItemRowProps {
  item: MenuItem;
  quantity?: number; // Current quantity in cart
  onAdd: () => void;
  onRemove?: () => void;
  onPress?: () => void;
}

export function MenuItemRow({
  item,
  quantity = 0,
  onAdd,
  onRemove,
  onPress,
}: MenuItemRowProps) {
  const { name, description, price, image, isAvailable, isPopular, calories } = item;

  return (
    <TouchableOpacity
      style={[styles.container, !isAvailable && styles.unavailable]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!isAvailable}
    >
      {/* Item Info */}
      <View style={styles.content}>
        {/* Popular badge */}
        {isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>🔥 Popular</Text>
          </View>
        )}

        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>{formatPrice(price)}</Text>
          {calories && (
            <Text style={styles.calories}>{calories} cal</Text>
          )}
        </View>
      </View>

      {/* Image and Add Button */}
      <View style={styles.rightSection}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholderImage]} />
        )}

        {/* Quantity controls or Add button */}
        {isAvailable && (
          <View style={styles.addSection}>
            {quantity > 0 ? (
              <View style={styles.quantityControls}>
                <IconButton
                  icon="minus"
                  size={18}
                  mode="contained"
                  containerColor={colors.surfaceVariant}
                  iconColor={colors.textPrimary}
                  onPress={onRemove}
                  style={styles.quantityButton}
                />
                <Text style={styles.quantity}>{quantity}</Text>
                <IconButton
                  icon="plus"
                  size={18}
                  mode="contained"
                  containerColor={colors.primary}
                  iconColor={colors.textInverse}
                  onPress={onAdd}
                  style={styles.quantityButton}
                />
              </View>
            ) : (
              <IconButton
                icon="plus"
                size={20}
                mode="contained"
                containerColor={colors.primary}
                iconColor={colors.textInverse}
                onPress={onAdd}
                style={styles.addButton}
              />
            )}
          </View>
        )}

        {!isAvailable && (
          <View style={styles.unavailableBadge}>
            <Text style={styles.unavailableText}>Unavailable</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  unavailable: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
    marginRight: spacing.md,
  },
  popularBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.warningLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  popularText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.warning,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  calories: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  rightSection: {
    alignItems: 'center',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: borderRadius.md,
    backgroundColor: colors.skeleton,
  },
  placeholderImage: {
    backgroundColor: colors.surfaceVariant,
  },
  addSection: {
    marginTop: -spacing.md,
  },
  addButton: {
    margin: 0,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xs,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quantityButton: {
    margin: 0,
    width: 32,
    height: 32,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    minWidth: 24,
    textAlign: 'center',
  },
  unavailableBadge: {
    marginTop: spacing.sm,
    backgroundColor: colors.errorLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  unavailableText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.error,
  },
});

export default MenuItemRow;

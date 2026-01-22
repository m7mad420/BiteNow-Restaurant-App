// Cart item row component
// Displays cart item with quantity controls and remove option

import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { CartItem } from '@/types';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { formatPrice } from '@/utils/formatters';

interface CartItemRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export function CartItemRow({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemRowProps) {
  const { name, price, quantity, image, specialInstructions } = item;
  const itemTotal = price * quantity;

  return (
    <View style={styles.container}>
      {/* Item Image */}
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholderImage]} />
      )}

      {/* Item Info */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          <IconButton
            icon="close"
            size={18}
            iconColor={colors.textSecondary}
            onPress={onRemove}
            style={styles.removeButton}
          />
        </View>

        {specialInstructions && (
          <Text style={styles.instructions} numberOfLines={1}>
            Note: {specialInstructions}
          </Text>
        )}

        <View style={styles.footer}>
          {/* Quantity controls */}
          <View style={styles.quantityControls}>
            <IconButton
              icon="minus"
              size={16}
              mode="contained"
              containerColor={colors.surfaceVariant}
              iconColor={colors.textPrimary}
              onPress={onDecrement}
              style={styles.quantityButton}
            />
            <Text style={styles.quantity}>{quantity}</Text>
            <IconButton
              icon="plus"
              size={16}
              mode="contained"
              containerColor={colors.primary}
              iconColor={colors.textInverse}
              onPress={onIncrement}
              style={styles.quantityButton}
            />
          </View>

          {/* Price */}
          <View style={styles.priceSection}>
            {quantity > 1 && (
              <Text style={styles.unitPrice}>{formatPrice(price)} each</Text>
            )}
            <Text style={styles.totalPrice}>{formatPrice(itemTotal)}</Text>
          </View>
        </View>
      </View>
    </View>
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
  image: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.md,
    backgroundColor: colors.skeleton,
  },
  placeholderImage: {
    backgroundColor: colors.surfaceVariant,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  removeButton: {
    margin: -spacing.sm,
  },
  instructions: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xs,
  },
  quantityButton: {
    margin: 0,
    width: 28,
    height: 28,
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    minWidth: 24,
    textAlign: 'center',
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  unitPrice: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default CartItemRow;

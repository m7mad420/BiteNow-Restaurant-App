// Menu Screen
// Shows restaurant menu with categories and add to cart

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SectionList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Text, Badge } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MenuCategory, MenuItem } from '@/types';
import { restaurantService } from '@/services';
import { getErrorMessage } from '@/services/api';
import { MenuItemRow, LoadingScreen, ErrorState, EmptyState } from '@/components';
import { useCartStore } from '@/stores';
import { CustomerStackParamList } from '@/navigation/types';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { formatPrice } from '@/utils/formatters';

type NavProp = NativeStackNavigationProp<CustomerStackParamList, 'Menu'>;

interface SectionData {
  title: string;
  data: MenuItem[];
}

export function MenuScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { restaurantId, restaurantName } = route.params as {
    restaurantId: string;
    restaurantName: string;
  };

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cart store
  const cartItems = useCartStore((state) => state.items);
  const cartRestaurantId = useCartStore((state) => state.restaurantId);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const setRestaurant = useCartStore((state) => state.setRestaurant);
  const clearCart = useCartStore((state) => state.clearCart);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    loadMenu();
  }, [restaurantId]);

  const loadMenu = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await restaurantService.getRestaurantMenu(restaurantId);
      setCategories(response.categories);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const getItemQuantity = (itemId: string): number => {
    const cartItem = cartItems.find((item) => item.id === itemId);
    return cartItem?.quantity || 0;
  };

  const handleAddItem = (item: MenuItem) => {
    // Check if cart has items from a different restaurant
    if (cartRestaurantId && cartRestaurantId !== restaurantId && cartItems.length > 0) {
      Alert.alert(
        'Start New Order?',
        'Your cart contains items from another restaurant. Would you like to clear it and start a new order?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clear Cart',
            style: 'destructive',
            onPress: () => {
              clearCart();
              setRestaurant(restaurantId, restaurantName);
              addItem(item);
            },
          },
        ]
      );
      return;
    }

    // Set restaurant if cart is empty
    if (!cartRestaurantId) {
      setRestaurant(restaurantId, restaurantName);
    }

    addItem(item);
  };

  const handleRemoveItem = (itemId: string) => {
    const currentQty = getItemQuantity(itemId);
    if (currentQty > 1) {
      updateQuantity(itemId, currentQty - 1);
    } else {
      removeItem(itemId);
    }
  };

  const handleViewCart = () => {
    navigation.navigate('Cart');
  };

  // Convert categories to section list format
  const sections: SectionData[] = categories.map((category) => ({
    title: category.name,
    data: category.items,
  }));

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadMenu} />;
  }

  if (categories.length === 0) {
    return (
      <EmptyState
        icon="food-off"
        title="No Menu Available"
        message="This restaurant hasn't added any items to their menu yet."
      />
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MenuItemRow
            item={item}
            quantity={getItemQuantity(item.id)}
            onAdd={() => handleAddItem(item)}
            onRemove={() => handleRemoveItem(item.id)}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        )}
        stickySectionHeadersEnabled
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: cartItemCount > 0 ? 100 : spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      />

      {/* View Cart FAB */}
      {cartItemCount > 0 && (
        <View style={[styles.cartBar, { paddingBottom: insets.bottom + spacing.md }]}>
          <TouchableOpacity
            onPress={handleViewCart}
            style={styles.cartButton}
            activeOpacity={0.8}
          >
            <View style={styles.cartButtonInner}>
              <Badge style={styles.cartBadge}>{cartItemCount}</Badge>
              <Text style={styles.cartButtonText}>View Cart</Text>
              <Text style={styles.cartButtonPrice}>{formatPrice(cartTotal)}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingTop: spacing.sm,
  },
  sectionHeader: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cartBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  cartButton: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  cartButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: spacing.sm,
  },
  cartBadge: {
    backgroundColor: colors.textInverse,
    color: colors.primary,
  },
  cartButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  cartButtonPrice: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MenuScreen;

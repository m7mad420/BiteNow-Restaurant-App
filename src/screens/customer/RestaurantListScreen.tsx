// Restaurant List Screen
// Home screen showing all restaurants with search

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Searchbar, Text, Chip, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Restaurant } from '@/types';
import { restaurantService } from '@/services';
import { getErrorMessage } from '@/services/api';
import { RestaurantCard, EmptyState, ErrorState, SkeletonList } from '@/components';
import { useCartStore } from '@/stores';
import { CustomerStackParamList } from '@/navigation/types';
import { colors, spacing } from '@/constants/theme';
import { CUISINE_TYPES } from '@/constants/config';

type NavProp = NativeStackNavigationProp<CustomerStackParamList, 'RestaurantList'>;

export function RestaurantListScreen() {
  const navigation = useNavigation<NavProp>();
  const cartItemCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadRestaurants = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const response = await restaurantService.getRestaurants({
        search: debouncedSearch || undefined,
        cuisine: selectedCuisine !== 'All' ? selectedCuisine : undefined,
      });

      setRestaurants(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [debouncedSearch, selectedCuisine]);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  const handleRestaurantPress = (restaurant: Restaurant) => {
    navigation.navigate('RestaurantDetail', { restaurantId: restaurant.id });
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Debounce the search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(query);
    }, 500);
  };

  const handleCuisineFilter = (cuisine: string) => {
    setSelectedCuisine(cuisine);
  };

  // Memoize cuisine chips to prevent re-renders
  const cuisineChips = useMemo(() => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipsContainer}
      keyboardShouldPersistTaps="always"
    >
      {CUISINE_TYPES.map((item) => (
        <Chip
          key={item}
          selected={selectedCuisine === item}
          onPress={() => handleCuisineFilter(item)}
          style={[
            styles.chip,
            selectedCuisine === item && styles.chipSelected,
          ]}
          textStyle={[
            styles.chipText,
            selectedCuisine === item && styles.chipTextSelected,
          ]}
          showSelectedOverlay={false}
        >
          {item}
        </Chip>
      ))}
    </ScrollView>
  ), [selectedCuisine]);

  const renderRestaurant = ({ item }: { item: Restaurant }) => (
    <RestaurantCard
      restaurant={item}
      onPress={() => handleRestaurantPress(item)}
    />
  );

  // Header component - rendered outside FlatList to prevent keyboard dismissal
  const renderHeader = () => (
    <View style={styles.header}>
      {/* App title and cart button */}
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.greeting}>Hello! 👋</Text>
          <Text style={styles.title}>What would you like to eat?</Text>
        </View>
        <View style={styles.cartButton}>
          <IconButton
            icon="cart"
            size={28}
            iconColor={colors.primary}
            onPress={handleCartPress}
          />
          {cartItemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Search bar */}
      <Searchbar
        placeholder="Search restaurants or cuisines..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
        iconColor={colors.textSecondary}
      />

      {/* Cuisine filter chips */}
      {cuisineChips}
    </View>
  );

  // Error state
  if (error && !isRefreshing) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <ErrorState
          message={error}
          onRetry={() => loadRestaurants()}
        />
      </SafeAreaView>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <SkeletonList count={3} variant="restaurant" />
      </SafeAreaView>
    );
  }

  // Empty state
  if (restaurants.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <EmptyState
          icon="store-search"
          title="No restaurants found"
          message={
            searchQuery || selectedCuisine !== 'All'
              ? 'Try adjusting your search or filters'
              : 'No restaurants available in your area'
          }
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setDebouncedSearch('');
            setSelectedCuisine('All');
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header rendered outside FlatList */}
      {renderHeader()}
      
      <FlatList
        data={restaurants}
        renderItem={renderRestaurant}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadRestaurants(true)}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cartButton: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: colors.textInverse,
    fontSize: 11,
    fontWeight: '600',
  },
  searchBar: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    elevation: 0,
    borderRadius: 12,
  },
  searchInput: {
    fontSize: 15,
  },
  chipsContainer: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  chipTextSelected: {
    color: colors.textInverse,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
});

export default RestaurantListScreen;

// Restaurant Detail Screen
// Shows restaurant info and links to menu

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Text, Button, Icon, Chip, IconButton } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Restaurant } from '@/types';
import { restaurantService } from '@/services';
import { getErrorMessage } from '@/services/api';
import { LoadingScreen, ErrorState } from '@/components';
import { CustomerStackParamList } from '@/navigation/types';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';
import { formatPrice } from '@/utils/formatters';

const { width } = Dimensions.get('window');

type NavProp = NativeStackNavigationProp<CustomerStackParamList, 'RestaurantDetail'>;

export function RestaurantDetailScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { restaurantId } = route.params as { restaurantId: string };

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRestaurant();
  }, [restaurantId]);

  const loadRestaurant = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await restaurantService.getRestaurantById(restaurantId);
      setRestaurant(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewMenu = () => {
    if (restaurant) {
      navigation.navigate('Menu', {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
      });
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !restaurant) {
    return <ErrorState message={error || 'Restaurant not found'} onRetry={loadRestaurant} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cover Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: restaurant.coverImage }} style={styles.coverImage} />
          <View style={[styles.overlay, { paddingTop: insets.top }]}>
            <IconButton
              icon="arrow-left"
              iconColor={colors.textInverse}
              size={24}
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            />
          </View>
          {!restaurant.isOpen && (
            <View style={styles.closedBanner}>
              <Text style={styles.closedText}>Currently Closed</Text>
            </View>
          )}
        </View>

        {/* Restaurant Info */}
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.name}>{restaurant.name}</Text>
            <View style={styles.ratingContainer}>
              <Icon source="star" size={20} color={colors.star} />
              <Text style={styles.rating}>{restaurant.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({restaurant.reviewCount} reviews)</Text>
            </View>
          </View>

          {/* Cuisine Tags */}
          <View style={styles.cuisineTags}>
            {restaurant.cuisine.map((cuisine, index) => (
              <Chip key={index} style={styles.cuisineChip} textStyle={styles.cuisineChipText}>
                {cuisine}
              </Chip>
            ))}
          </View>

          {/* Description */}
          <Text style={styles.description}>{restaurant.description}</Text>

          {/* Info Cards */}
          <View style={styles.infoCards}>
            {/* Delivery Time */}
            <View style={styles.infoCard}>
              <Icon source="clock-outline" size={24} color={colors.primary} />
              <Text style={styles.infoLabel}>Delivery Time</Text>
              <Text style={styles.infoValue}>{restaurant.deliveryTime}</Text>
            </View>

            {/* Delivery Fee */}
            <View style={styles.infoCard}>
              <Icon source="bike-fast" size={24} color={colors.primary} />
              <Text style={styles.infoLabel}>Delivery Fee</Text>
              <Text style={styles.infoValue}>
                {restaurant.deliveryFee === 0 ? 'Free' : formatPrice(restaurant.deliveryFee)}
              </Text>
            </View>

            {/* Minimum Order */}
            <View style={styles.infoCard}>
              <Icon source="cash" size={24} color={colors.primary} />
              <Text style={styles.infoLabel}>Min. Order</Text>
              <Text style={styles.infoValue}>{formatPrice(restaurant.minimumOrder)}</Text>
            </View>
          </View>

          {/* Address */}
          <View style={styles.addressSection}>
            <Icon source="map-marker-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.address}>{restaurant.address}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          mode="contained"
          onPress={handleViewMenu}
          style={styles.menuButton}
          contentStyle={styles.menuButtonContent}
          labelStyle={styles.menuButtonLabel}
          buttonColor={colors.primary}
          disabled={!restaurant.isOpen}
        >
          {restaurant.isOpen ? 'View Menu' : 'Restaurant Closed'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    position: 'relative',
  },
  coverImage: {
    width,
    height: 250,
    backgroundColor: colors.skeleton,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.sm,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    margin: 0,
  },
  closedBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  closedText: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.md,
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  cuisineTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cuisineChip: {
    backgroundColor: colors.surfaceVariant,
  },
  cuisineChipText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  infoCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    ...shadows.small,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  address: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  menuButton: {
    borderRadius: borderRadius.lg,
  },
  menuButtonContent: {
    paddingVertical: spacing.sm,
  },
  menuButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RestaurantDetailScreen;

// Order Success Screen
// Confirmation after successful order placement

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Icon } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { CustomerStackParamList } from '@/navigation/types';
import { colors, spacing, borderRadius } from '@/constants/theme';

type NavProp = NativeStackNavigationProp<CustomerStackParamList, 'OrderSuccess'>;

export function OrderSuccessScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute();
  const { orderId } = route.params as { orderId: string };

  // Get order number from order ID (last 8 chars)
  const orderNumber = orderId.slice(-8).toUpperCase();

  const handleTrackOrder = () => {
    navigation.reset({
      index: 0,
      routes: [
        { name: 'RestaurantList' },
        { name: 'OrderDetail', params: { orderId } },
      ],
    });
  };

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'RestaurantList' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Icon source="check" size={64} color={colors.textInverse} />
          </View>
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>
          Your order has been successfully placed and is being prepared.
        </Text>

        {/* Order Number */}
        <View style={styles.orderNumberContainer}>
          <Text style={styles.orderNumberLabel}>Order Number</Text>
          <Text style={styles.orderNumber}>#{orderNumber}</Text>
        </View>

        {/* Estimated Time */}
        <View style={styles.estimateContainer}>
          <Icon source="clock-outline" size={24} color={colors.primary} />
          <View style={styles.estimateText}>
            <Text style={styles.estimateLabel}>Estimated Delivery Time</Text>
            <Text style={styles.estimateValue}>25-35 minutes</Text>
          </View>
        </View>

        {/* Info Text */}
        <Text style={styles.infoText}>
          You will receive a notification when your order is on its way.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={handleTrackOrder}
          style={styles.primaryButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          buttonColor={colors.primary}
        >
          Track Order
        </Button>

        <Button
          mode="outlined"
          onPress={handleBackToHome}
          style={styles.secondaryButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.secondaryButtonLabel}
        >
          Back to Home
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  orderNumberContainer: {
    backgroundColor: colors.surfaceVariant,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  orderNumberLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 2,
  },
  estimateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  estimateText: {
    marginLeft: spacing.md,
  },
  estimateLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  estimateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  actions: {
    gap: spacing.md,
  },
  primaryButton: {
    borderRadius: borderRadius.lg,
  },
  secondaryButton: {
    borderRadius: borderRadius.lg,
    borderColor: colors.primary,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default OrderSuccessScreen;

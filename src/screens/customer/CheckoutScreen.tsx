// Checkout Screen
// Address entry and order placement

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, TextInput, Button, RadioButton, Divider, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCartStore } from '@/stores';
import { orderService } from '@/services';
import { getErrorMessage } from '@/services/api';
import { checkoutSchema, CheckoutFormData } from '@/utils/validators';
import { CustomerStackParamList } from '@/navigation/types';
import { PAYMENT_METHODS } from '@/constants/config';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { formatPrice } from '@/utils/formatters';

type NavProp = NativeStackNavigationProp<CustomerStackParamList, 'Checkout'>;

export function CheckoutScreen() {
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cart store
  const items = useCartStore((state) => state.items);
  const restaurantId = useCartStore((state) => state.restaurantId);
  const restaurantName = useCartStore((state) => state.restaurantName);
  const getSummary = useCartStore((state) => state.getSummary);
  const clearCart = useCartStore((state) => state.clearCart);

  const summary = getSummary();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        instructions: '',
      },
      paymentMethod: PAYMENT_METHODS[0].id,
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (!restaurantId || !restaurantName) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const orderData = {
        restaurantId,
        restaurantName,
        items: items.map((item) => ({
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions,
        })),
        deliveryAddress: data.deliveryAddress,
        paymentMethod: data.paymentMethod,
        subtotal: summary.subtotal,
        tax: summary.tax,
        deliveryFee: summary.deliveryFee,
        total: summary.total,
      };

      const order = await orderService.createOrder(orderData);

      // Clear cart and navigate to success
      clearCart();
      navigation.reset({
        index: 0,
        routes: [
          { name: 'RestaurantList' },
          { name: 'OrderSuccess', params: { orderId: order.id } },
        ],
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Error message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Delivery Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>

          <Controller
            control={control}
            name="deliveryAddress.street"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  label="Street Address"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.deliveryAddress?.street}
                  mode="outlined"
                  outlineColor={colors.divider}
                  activeOutlineColor={colors.primary}
                  style={styles.input}
                />
                <HelperText type="error" visible={!!errors.deliveryAddress?.street}>
                  {errors.deliveryAddress?.street?.message}
                </HelperText>
              </View>
            )}
          />

          <View style={styles.row}>
            <Controller
              control={control}
              name="deliveryAddress.city"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputContainer, styles.flex1]}>
                  <TextInput
                    label="City"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={!!errors.deliveryAddress?.city}
                    mode="outlined"
                    outlineColor={colors.divider}
                    activeOutlineColor={colors.primary}
                    style={styles.input}
                  />
                  <HelperText type="error" visible={!!errors.deliveryAddress?.city}>
                    {errors.deliveryAddress?.city?.message}
                  </HelperText>
                </View>
              )}
            />

            <Controller
              control={control}
              name="deliveryAddress.state"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputContainer, styles.flex1, styles.marginLeft]}>
                  <TextInput
                    label="State"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={!!errors.deliveryAddress?.state}
                    mode="outlined"
                    outlineColor={colors.divider}
                    activeOutlineColor={colors.primary}
                    style={styles.input}
                  />
                  <HelperText type="error" visible={!!errors.deliveryAddress?.state}>
                    {errors.deliveryAddress?.state?.message}
                  </HelperText>
                </View>
              )}
            />
          </View>

          <Controller
            control={control}
            name="deliveryAddress.zipCode"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  label="ZIP Code"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.deliveryAddress?.zipCode}
                  keyboardType="numeric"
                  mode="outlined"
                  outlineColor={colors.divider}
                  activeOutlineColor={colors.primary}
                  style={[styles.input, { width: 150 }]}
                />
                <HelperText type="error" visible={!!errors.deliveryAddress?.zipCode}>
                  {errors.deliveryAddress?.zipCode?.message}
                </HelperText>
              </View>
            )}
          />

          <Controller
            control={control}
            name="deliveryAddress.instructions"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  label="Delivery Instructions (optional)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  outlineColor={colors.divider}
                  activeOutlineColor={colors.primary}
                  style={styles.input}
                  multiline
                  numberOfLines={2}
                  placeholder="e.g., Ring doorbell, leave at door..."
                />
              </View>
            )}
          />
        </View>

        <Divider style={styles.divider} />

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <Controller
            control={control}
            name="paymentMethod"
            render={({ field: { onChange, value } }) => (
              <RadioButton.Group onValueChange={onChange} value={value}>
                {PAYMENT_METHODS.map((method) => (
                  <RadioButton.Item
                    key={method.id}
                    label={method.label}
                    value={method.id}
                    style={styles.radioItem}
                    labelStyle={styles.radioLabel}
                  />
                ))}
              </RadioButton.Group>
            )}
          />
        </View>

        <Divider style={styles.divider} />

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {restaurantName} ({summary.itemCount} items)
            </Text>
            <Text style={styles.summaryValue}>{formatPrice(summary.subtotal)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>{formatPrice(summary.tax)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>{formatPrice(summary.deliveryFee)}</Text>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(summary.total)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.orderButton}
          contentStyle={styles.orderButtonContent}
          labelStyle={styles.orderButtonLabel}
          buttonColor={colors.primary}
        >
          Place Order • {formatPrice(summary.total)}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  errorContainer: {
    backgroundColor: colors.errorLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  marginLeft: {
    marginLeft: spacing.sm,
  },
  divider: {
    marginVertical: spacing.md,
  },
  radioItem: {
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
  },
  radioLabel: {
    fontSize: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  totalRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  bottomBar: {
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
  orderButton: {
    borderRadius: borderRadius.lg,
  },
  orderButtonContent: {
    paddingVertical: spacing.sm,
  },
  orderButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CheckoutScreen;

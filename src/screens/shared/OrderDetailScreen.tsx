// Order Detail Screen
// Shared screen for viewing order details

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Divider, Icon, Button } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Order, OrderStatus } from '@/types';
import { orderService } from '@/services';
import { getErrorMessage } from '@/services/api';
import { LoadingScreen, ErrorState, OrderStatusBadge } from '@/components';
import { useAuthStore } from '@/stores';
import { ORDER_STATUS_CONFIG } from '@/constants/config';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';
import { formatPrice, formatDateTime, formatOrderNumber } from '@/utils/formatters';

// Status timeline order
const STATUS_ORDER: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered',
];

export function OrderDetailScreen() {
  const route = useRoute();
  const { orderId } = route.params as { orderId: string };
  const userRole = useAuthStore((state) => state.user?.role);

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIndex = (status: OrderStatus): number => {
    return STATUS_ORDER.indexOf(status);
  };

  const isStatusCompleted = (status: OrderStatus, currentStatus: OrderStatus): boolean => {
    if (currentStatus === 'cancelled') return false;
    return getStatusIndex(status) <= getStatusIndex(currentStatus);
  };

  const isStatusActive = (status: OrderStatus, currentStatus: OrderStatus): boolean => {
    return status === currentStatus;
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !order) {
    return <ErrorState message={error || 'Order not found'} onRetry={loadOrder} />;
  }

  const isCancelled = order.status === 'cancelled';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Order Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.orderNumber}>
              Order {formatOrderNumber(order.id)}
            </Text>
            <OrderStatusBadge status={order.status} />
          </View>
          <Text style={styles.orderDate}>
            Placed on {formatDateTime(order.createdAt)}
          </Text>
        </View>

        {/* Status Timeline */}
        {!isCancelled && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Status</Text>
            <View style={styles.timeline}>
              {STATUS_ORDER.map((status, index) => {
                const isCompleted = isStatusCompleted(status, order.status);
                const isActive = isStatusActive(status, order.status);
                const config = ORDER_STATUS_CONFIG[status];

                return (
                  <View key={status} style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View
                        style={[
                          styles.timelineCircle,
                          isCompleted && styles.timelineCircleCompleted,
                          isActive && styles.timelineCircleActive,
                        ]}
                      >
                        {isCompleted && (
                          <Icon
                            source="check"
                            size={14}
                            color={colors.textInverse}
                          />
                        )}
                      </View>
                      {index < STATUS_ORDER.length - 1 && (
                        <View
                          style={[
                            styles.timelineLine,
                            isCompleted && styles.timelineLineCompleted,
                          ]}
                        />
                      )}
                    </View>
                    <View style={styles.timelineContent}>
                      <Text
                        style={[
                          styles.timelineLabel,
                          isActive && styles.timelineLabelActive,
                        ]}
                      >
                        {config.label}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Cancelled Notice */}
        {isCancelled && (
          <View style={styles.cancelledSection}>
            <Icon source="cancel" size={24} color={colors.error} />
            <Text style={styles.cancelledText}>This order was cancelled</Text>
          </View>
        )}

        <Divider style={styles.divider} />

        {/* Restaurant Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Restaurant</Text>
          <View style={styles.restaurantCard}>
            <Icon source="store" size={24} color={colors.primary} />
            <Text style={styles.restaurantName}>{order.restaurantName}</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <View style={styles.orderItemLeft}>
                <Text style={styles.orderItemQuantity}>{item.quantity}x</Text>
                <View>
                  <Text style={styles.orderItemName}>{item.name}</Text>
                  {item.specialInstructions && (
                    <Text style={styles.orderItemNote}>
                      Note: {item.specialInstructions}
                    </Text>
                  )}
                </View>
              </View>
              <Text style={styles.orderItemPrice}>
                {formatPrice(item.price * item.quantity)}
              </Text>
            </View>
          ))}
        </View>

        <Divider style={styles.divider} />

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressCard}>
            <Icon source="map-marker" size={20} color={colors.primary} />
            <View style={styles.addressContent}>
              <Text style={styles.addressText}>
                {order.deliveryAddress.street}
              </Text>
              <Text style={styles.addressText}>
                {order.deliveryAddress.city}, {order.deliveryAddress.state}{' '}
                {order.deliveryAddress.zipCode}
              </Text>
              {order.deliveryAddress.instructions && (
                <Text style={styles.addressNote}>
                  {order.deliveryAddress.instructions}
                </Text>
              )}
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Payment Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatPrice(order.subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>{formatPrice(order.tax)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>
                {formatPrice(order.deliveryFee)}
              </Text>
            </View>
            <Divider style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.paymentMethod}>
            <Icon source="credit-card" size={20} color={colors.textSecondary} />
            <Text style={styles.paymentMethodText}>
              Paid with {order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Card'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  orderDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  divider: {
    marginHorizontal: spacing.md,
  },
  timeline: {
    paddingLeft: spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 50,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 30,
  },
  timelineCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceVariant,
    borderWidth: 2,
    borderColor: colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineCircleCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  timelineCircleActive: {
    borderColor: colors.primary,
    borderWidth: 3,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.divider,
    marginVertical: 4,
  },
  timelineLineCompleted: {
    backgroundColor: colors.success,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: spacing.md,
    paddingTop: 2,
  },
  timelineLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  timelineLabelActive: {
    fontWeight: '600',
    color: colors.primary,
  },
  cancelledSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorLight,
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  cancelledText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.error,
    marginLeft: spacing.sm,
  },
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
  },
  orderItemLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  orderItemQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    width: 30,
  },
  orderItemName: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  orderItemNote: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  orderItemPrice: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: spacing.md,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  addressContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  addressText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  addressNote: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  summaryDivider: {
    marginVertical: spacing.sm,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  paymentMethodText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
});

export default OrderDetailScreen;

// Admin Orders Screen
// List all orders with status management

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { Text, SegmentedButtons, Chip } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrderListItem, OrderStatus } from '@/types';
import { orderService } from '@/services';
import { getErrorMessage } from '@/services/api';
import { OrderCard, EmptyState, ErrorState, SkeletonList } from '@/components';
import { colors, spacing } from '@/constants/theme';
import { ORDER_STATUS_CONFIG } from '@/constants/config';

type FilterValue = 'all' | 'pending' | 'active' | 'completed';

export function AdminOrdersScreen() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterValue>('pending');

  const loadOrders = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const response = await orderService.getAllOrders();
      setOrders(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Reload orders when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  const handleStatusUpdate = async (orderId: string, currentStatus: OrderStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) return;

    const statusConfig = ORDER_STATUS_CONFIG[nextStatus];

    Alert.alert(
      'Update Order Status',
      `Change order status to "${statusConfig.label}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: async () => {
            try {
              await orderService.updateOrderStatus(orderId, nextStatus);
              // Refresh orders
              loadOrders(true);
            } catch (err) {
              Alert.alert('Error', getErrorMessage(err));
            }
          },
        },
      ]
    );
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const statusFlow: Record<OrderStatus, OrderStatus | null> = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'out_for_delivery',
      out_for_delivery: 'delivered',
      delivered: null,
      cancelled: null,
    };
    return statusFlow[currentStatus];
  };

  // Filter orders based on selected filter
  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return order.status === 'pending';
    if (filter === 'active') {
      return ['confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(order.status);
    }
    if (filter === 'completed') {
      return ['delivered', 'cancelled'].includes(order.status);
    }
    return true;
  });

  // Count orders by status for badges
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const activeCount = orders.filter((o) =>
    ['confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(o.status)
  ).length;

  // Error state
  if (error && !isRefreshing && orders.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState message={error} onRetry={() => loadOrders()} />
      </SafeAreaView>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Orders Management</Text>
        </View>
        <SkeletonList count={4} variant="order" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders Management</Text>
        <Text style={styles.subtitle}>
          {orders.length} total orders • {pendingCount} pending
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={filter}
          onValueChange={(value) => setFilter(value as FilterValue)}
          buttons={[
            { value: 'pending', label: `Pending (${pendingCount})` },
            { value: 'active', label: `Active (${activeCount})` },
            { value: 'completed', label: 'History' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Orders List */}
      {orders.length === 0 ? (
        <EmptyState
          icon="receipt"
          title="No orders yet"
          message="Orders will appear here when customers place them."
        />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon="filter-off"
          title="No orders found"
          message={`No ${filter} orders at the moment.`}
        />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <OrderCard
                order={item}
                onPress={() => {}}
                showActions
              />
              {/* Quick Action Buttons */}
              {getNextStatus(item.status) && (
                <View style={styles.actionRow}>
                  <Chip
                    icon="check"
                    onPress={() => handleStatusUpdate(item.id, item.status)}
                    style={styles.actionChip}
                    textStyle={styles.actionChipText}
                  >
                    Mark as {ORDER_STATUS_CONFIG[getNextStatus(item.status)!].label}
                  </Chip>
                </View>
              )}
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadOrders(true)}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  filterContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  segmentedButtons: {
    backgroundColor: colors.surface,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  orderItem: {
    marginBottom: spacing.sm,
  },
  actionRow: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: -spacing.sm,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  actionChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
  },
  actionChipText: {
    color: colors.primary,
    fontSize: 13,
  },
});

export default AdminOrdersScreen;

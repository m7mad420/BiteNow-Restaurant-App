// Order service
// Uses mock data for development - replace with real API calls in production

import api from './api';
import {
  Order,
  OrderListItem,
  OrderListResponse,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  OrderStatus,
} from '@/types';
import { mockOrders } from '@/constants/mockData';

// In-memory store for orders (mock database)
let orders = [...mockOrders];
let orderIdCounter = 100;

// Simulated delay for mock API
const mockDelay = () => new Promise((resolve) => setTimeout(resolve, 600));

/**
 * Get orders for the current user (customer sees their orders, admin sees all)
 */
export async function getOrders(
  params?: {
    status?: OrderStatus;
    page?: number;
    limit?: number;
  },
  isAdmin?: boolean
): Promise<OrderListResponse> {
  // TODO: Replace with real API call
  // return api.get('/orders', { params }).then(res => res.data);

  // Mock implementation
  await mockDelay();

  let filtered = [...orders];

  // Admin sees all orders, customer sees only their own
  if (!isAdmin) {
    filtered = filtered.filter((o) => o.userId === 'usr_001'); // Mock user ID
  }

  // Filter by status if provided
  if (params?.status) {
    filtered = filtered.filter((o) => o.status === params.status);
  }

  // Sort by created date (newest first)
  filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Pagination
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const startIndex = (page - 1) * limit;
  const paginatedData = filtered.slice(startIndex, startIndex + limit);

  // Map to list items
  const listItems: OrderListItem[] = paginatedData.map((order) => ({
    id: order.id,
    restaurantName: order.restaurantName,
    restaurantImage: order.restaurantImage,
    status: order.status,
    total: order.total,
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    createdAt: order.createdAt,
  }));

  return {
    data: listItems,
    meta: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    },
  };
}

/**
 * Get a single order by ID
 */
export async function getOrderById(orderId: string): Promise<Order> {
  // TODO: Replace with real API call
  // return api.get(`/orders/${orderId}`).then(res => res.data);

  // Mock implementation
  await mockDelay();

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    throw {
      message: 'Order not found',
      status: 404,
      code: 'NOT_FOUND',
    };
  }

  return order;
}

/**
 * Create a new order
 */
export async function createOrder(orderData: CreateOrderRequest): Promise<Order> {
  // TODO: Replace with real API call
  // return api.post('/orders', orderData).then(res => res.data);

  // Mock implementation
  await mockDelay();

  const newOrder: Order = {
    id: `ord_${++orderIdCounter}`,
    userId: 'usr_001', // Mock user ID
    restaurantId: orderData.restaurantId,
    restaurantName: orderData.restaurantName,
    items: orderData.items.map((item, index) => ({
      id: `oi_${Date.now()}_${index}`,
      menuItemId: item.menuItemId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      specialInstructions: item.specialInstructions,
    })),
    status: 'pending',
    subtotal: orderData.subtotal,
    tax: orderData.tax,
    deliveryFee: orderData.deliveryFee,
    total: orderData.total,
    deliveryAddress: orderData.deliveryAddress,
    paymentMethod: orderData.paymentMethod,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDelivery: new Date(
      Date.now() + 45 * 60 * 1000
    ).toISOString(), // 45 min from now
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date().toISOString(),
      },
    ],
  };

  // Add to mock database
  orders = [newOrder, ...orders];

  // Simulate order confirmation after short delay
  setTimeout(() => {
    const orderIndex = orders.findIndex((o) => o.id === newOrder.id);
    if (orderIndex !== -1) {
      orders[orderIndex] = {
        ...orders[orderIndex],
        status: 'confirmed',
        updatedAt: new Date().toISOString(),
        statusHistory: [
          ...orders[orderIndex].statusHistory,
          {
            status: 'confirmed',
            timestamp: new Date().toISOString(),
          },
        ],
      };
    }
  }, 3000);

  return newOrder;
}

/**
 * Update order status (admin only)
 */
export async function updateOrderStatus(
  orderId: string,
  data: UpdateOrderStatusRequest
): Promise<Order> {
  // TODO: Replace with real API call
  // return api.patch(`/orders/${orderId}/status`, data).then(res => res.data);

  // Mock implementation
  await mockDelay();

  const orderIndex = orders.findIndex((o) => o.id === orderId);

  if (orderIndex === -1) {
    throw {
      message: 'Order not found',
      status: 404,
      code: 'NOT_FOUND',
    };
  }

  const updatedOrder: Order = {
    ...orders[orderIndex],
    status: data.status,
    updatedAt: new Date().toISOString(),
    statusHistory: [
      ...orders[orderIndex].statusHistory,
      {
        status: data.status,
        timestamp: new Date().toISOString(),
        note: data.note,
      },
    ],
  };

  orders[orderIndex] = updatedOrder;

  return updatedOrder;
}

/**
 * Cancel an order (customer can cancel pending orders)
 */
export async function cancelOrder(orderId: string): Promise<Order> {
  return updateOrderStatus(orderId, {
    status: 'cancelled',
    note: 'Cancelled by customer',
  });
}

/**
 * Get active orders count (for badge display)
 */
export async function getActiveOrdersCount(isAdmin?: boolean): Promise<number> {
  await mockDelay();

  const activeStatuses: OrderStatus[] = [
    'pending',
    'confirmed',
    'preparing',
    'ready',
    'out_for_delivery',
  ];

  let filtered = orders.filter((o) => activeStatuses.includes(o.status));

  if (!isAdmin) {
    filtered = filtered.filter((o) => o.userId === 'usr_001');
  }

  return filtered.length;
}

export default {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getActiveOrdersCount,
};

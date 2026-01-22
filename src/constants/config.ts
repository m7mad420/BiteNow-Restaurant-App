// App configuration constants

// API Configuration
// In production, replace with your actual API URL
export const API_URL = process.env.API_URL || 'http://localhost:3001';

// App Configuration
export const APP_CONFIG = {
  name: 'BiteNow',
  version: '1.0.0',
  
  // Pagination
  defaultPageSize: 10,
  
  // Cart
  taxRate: 0.08, // 8% tax
  defaultDeliveryFee: 2.99,
  
  // Timeouts
  apiTimeout: 10000, // 10 seconds
  
  // Storage keys
  storageKeys: {
    authToken: 'bitenow_auth_token',
    refreshToken: 'bitenow_refresh_token',
    cart: 'bitenow_cart',
    onboardingComplete: 'bitenow_onboarding_complete',
    userPreferences: 'bitenow_user_preferences',
  },
} as const;

// Order status configuration
export const ORDER_STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: '#FF9800',
    icon: 'clock-outline',
    description: 'Waiting for restaurant confirmation',
  },
  confirmed: {
    label: 'Confirmed',
    color: '#2196F3',
    icon: 'check-circle-outline',
    description: 'Restaurant has accepted your order',
  },
  preparing: {
    label: 'Preparing',
    color: '#9C27B0',
    icon: 'food-variant',
    description: 'Your food is being prepared',
  },
  ready: {
    label: 'Ready',
    color: '#4CAF50',
    icon: 'package-variant',
    description: 'Your order is ready for pickup/delivery',
  },
  out_for_delivery: {
    label: 'On the Way',
    color: '#00BCD4',
    icon: 'bike-fast',
    description: 'Your order is on the way',
  },
  delivered: {
    label: 'Delivered',
    color: '#4CAF50',
    icon: 'check-circle',
    description: 'Your order has been delivered',
  },
  cancelled: {
    label: 'Cancelled',
    color: '#F44336',
    icon: 'close-circle',
    description: 'Order has been cancelled',
  },
} as const;

// Cuisine types for filtering
export const CUISINE_TYPES = [
  'All',
  'American',
  'Italian',
  'Chinese',
  'Japanese',
  'Mexican',
  'Indian',
  'Thai',
  'Mediterranean',
  'Fast Food',
  'Pizza',
  'Burgers',
  'Sushi',
  'Healthy',
  'Desserts',
] as const;

// Payment methods (placeholder)
export const PAYMENT_METHODS = [
  { id: 'card_4242', label: 'Visa ending in 4242', icon: 'credit-card' },
  { id: 'card_5555', label: 'Mastercard ending in 5555', icon: 'credit-card' },
  { id: 'cash', label: 'Cash on Delivery', icon: 'cash' },
] as const;

export default APP_CONFIG;

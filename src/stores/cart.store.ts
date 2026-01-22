// Cart store using Zustand
// Manages shopping cart state with AsyncStorage persistence

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, MenuItem, CartSummary } from '@/types';
import { APP_CONFIG } from '@/constants/config';

interface CartState {
  // State
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;

  // Computed
  itemCount: number;
  isEmpty: boolean;

  // Actions
  addItem: (item: MenuItem, quantity?: number, specialInstructions?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateInstructions: (itemId: string, instructions: string) => void;
  clearCart: () => void;
  setRestaurant: (id: string, name: string) => void;

  // Calculations
  _roundPrice: (value: number) => number;
  getSubtotal: () => number;
  getTax: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
  getSummary: () => CartSummary;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      restaurantId: null,
      restaurantName: null,

      // Computed
      get itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
      get isEmpty() {
        return get().items.length === 0;
      },

      // Set restaurant info
      setRestaurant: (id: string, name: string) => {
        const { restaurantId, items } = get();

        // If switching to a different restaurant, clear cart
        if (restaurantId && restaurantId !== id && items.length > 0) {
          // This will be handled by the UI with a confirmation dialog
          // For now, just update the restaurant
        }

        set({ restaurantId: id, restaurantName: name });
      },

      // Add item to cart
      addItem: (
        item: MenuItem,
        quantity: number = 1,
        specialInstructions?: string
      ) => {
        const { items, restaurantId } = get();

        // If cart has items from a different restaurant, clear it first
        // (UI should confirm this before calling addItem)
        if (restaurantId && restaurantId !== item.restaurantId) {
          set({
            items: [],
            restaurantId: item.restaurantId,
            restaurantName: null, // Will be set separately
          });
        }

        // Check if item already exists in cart
        const existingIndex = items.findIndex((i) => i.id === item.id);

        if (existingIndex >= 0) {
          // Update existing item quantity
          const newItems = [...items];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + quantity,
            specialInstructions:
              specialInstructions || newItems[existingIndex].specialInstructions,
          };
          set({ items: newItems });
        } else {
          // Add new item
          const cartItem: CartItem = {
            id: item.id,
            restaurantId: item.restaurantId,
            name: item.name,
            price: item.price,
            quantity,
            image: item.image,
            specialInstructions,
          };
          set({
            items: [...items, cartItem],
            restaurantId: item.restaurantId,
          });
        }
      },

      // Remove item from cart
      removeItem: (itemId: string) => {
        const { items } = get();
        const newItems = items.filter((item) => item.id !== itemId);

        // If cart is empty after removal, clear restaurant info
        if (newItems.length === 0) {
          set({ items: [], restaurantId: null, restaurantName: null });
        } else {
          set({ items: newItems });
        }
      },

      // Update item quantity
      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          get().removeItem(itemId);
          return;
        }

        const { items } = get();
        const newItems = items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        );
        set({ items: newItems });
      },

      // Update special instructions
      updateInstructions: (itemId: string, instructions: string) => {
        const { items } = get();
        const newItems = items.map((item) =>
          item.id === itemId
            ? { ...item, specialInstructions: instructions }
            : item
        );
        set({ items: newItems });
      },

      // Clear entire cart
      clearCart: () => {
        set({ items: [], restaurantId: null, restaurantName: null });
      },

      // Helper to round to 2 decimal places
      _roundPrice: (value: number) => {
        return Math.round(value * 100) / 100;
      },

      // Calculate subtotal
      getSubtotal: () => {
        const subtotal = get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        return get()._roundPrice(subtotal);
      },

      // Calculate tax
      getTax: () => {
        const subtotal = get().getSubtotal();
        return get()._roundPrice(subtotal * APP_CONFIG.taxRate);
      },

      // Get delivery fee
      getDeliveryFee: () => {
        const { items } = get();
        return items.length > 0 ? APP_CONFIG.defaultDeliveryFee : 0;
      },

      // Calculate total
      getTotal: () => {
        const subtotal = get().getSubtotal();
        const tax = get()._roundPrice(subtotal * APP_CONFIG.taxRate);
        const deliveryFee = get().getDeliveryFee();
        return get()._roundPrice(subtotal + tax + deliveryFee);
      },

      // Get cart summary
      getSummary: (): CartSummary => {
        const state = get();
        return {
          subtotal: state.getSubtotal(),
          tax: state.getTax(),
          deliveryFee: state.getDeliveryFee(),
          total: state.getTotal(),
          itemCount: state.items.reduce((sum, item) => sum + item.quantity, 0),
        };
      },
    }),
    {
      name: APP_CONFIG.storageKeys.cart,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Selectors
export const selectCartItems = (state: CartState) => state.items;
export const selectCartItemCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartRestaurantId = (state: CartState) => state.restaurantId;
export const selectIsCartEmpty = (state: CartState) => state.items.length === 0;

export default useCartStore;

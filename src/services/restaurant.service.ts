// Restaurant service
// Uses mock data for development - replace with real API calls in production

import api from './api';
import {
  Restaurant,
  RestaurantListResponse,
  RestaurantFilters,
  MenuResponse,
} from '@/types';
import { mockRestaurants, mockMenus } from '@/constants/mockData';
import { APP_CONFIG } from '@/constants/config';

// Simulated delay for mock API
const mockDelay = () => new Promise((resolve) => setTimeout(resolve, 600));

/**
 * Get list of restaurants with optional filters
 */
export async function getRestaurants(
  filters?: RestaurantFilters
): Promise<RestaurantListResponse> {
  // TODO: Replace with real API call
  // return api.get('/restaurants', { params: filters }).then(res => res.data);

  // Mock implementation
  await mockDelay();

  let filtered = [...mockRestaurants];

  // Apply search filter
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.name.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower) ||
        r.cuisine.some((c) => c.toLowerCase().includes(searchLower))
    );
  }

  // Apply cuisine filter
  if (filters?.cuisine && filters.cuisine !== 'All') {
    filtered = filtered.filter((r) =>
      r.cuisine.some((c) => c.toLowerCase() === filters.cuisine?.toLowerCase())
    );
  }

  // Apply sorting
  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'deliveryFee':
        filtered.sort((a, b) => a.deliveryFee - b.deliveryFee);
        break;
      case 'deliveryTime':
        // Extract first number from delivery time string for sorting
        filtered.sort((a, b) => {
          const aTime = parseInt(a.deliveryTime) || 0;
          const bTime = parseInt(b.deliveryTime) || 0;
          return aTime - bTime;
        });
        break;
    }
  }

  // Apply pagination
  const page = filters?.page || 1;
  const limit = filters?.limit || APP_CONFIG.defaultPageSize;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filtered.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    meta: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    },
  };
}

/**
 * Get a single restaurant by ID
 */
export async function getRestaurantById(id: string): Promise<Restaurant> {
  // TODO: Replace with real API call
  // return api.get(`/restaurants/${id}`).then(res => res.data);

  // Mock implementation
  await mockDelay();

  const restaurant = mockRestaurants.find((r) => r.id === id);

  if (!restaurant) {
    throw {
      message: 'Restaurant not found',
      status: 404,
      code: 'NOT_FOUND',
    };
  }

  return restaurant;
}

/**
 * Get menu for a restaurant
 */
export async function getRestaurantMenu(restaurantId: string): Promise<MenuResponse> {
  // TODO: Replace with real API call
  // return api.get(`/restaurants/${restaurantId}/menu`).then(res => res.data);

  // Mock implementation
  await mockDelay();

  const categories = mockMenus[restaurantId];

  if (!categories) {
    throw {
      message: 'Menu not found',
      status: 404,
      code: 'NOT_FOUND',
    };
  }

  return {
    restaurantId,
    categories,
  };
}

/**
 * Search restaurants
 */
export async function searchRestaurants(query: string): Promise<Restaurant[]> {
  const response = await getRestaurants({ search: query });
  return response.data;
}

export default {
  getRestaurants,
  getRestaurantById,
  getRestaurantMenu,
  searchRestaurants,
};

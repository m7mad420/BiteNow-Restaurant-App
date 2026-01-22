// Restaurant types

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  coverImage: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string; // e.g., "25-35 min"
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
  address: string;
}

export interface RestaurantListResponse {
  data: Restaurant[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RestaurantFilters {
  search?: string;
  cuisine?: string;
  sortBy?: 'rating' | 'deliveryTime' | 'deliveryFee';
  page?: number;
  limit?: number;
}

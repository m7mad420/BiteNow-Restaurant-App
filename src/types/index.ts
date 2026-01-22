// Barrel export for all types

export * from './user.types';
export * from './restaurant.types';
export * from './menu.types';
export * from './cart.types';
export * from './order.types';

// Common types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Re-export all types from a central location
export * from './product';
export * from './category';
export * from './organization';
export * from './common';
export * from './user';
export * from './cart';
export * from './order';
export * from './review';
export * from './wishlist';
export * from './store';

// Common utility types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface FilterState {
  search: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

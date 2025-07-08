import { CartItem } from './cart';
import type { Category } from './category';
import { OrderItem } from './order';
import type { Organization } from './organization';
import { Review } from './review';

// Core Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  mrp?: number;
  sku: string;
  imageUrl?: string;
  images?: string[];
  quantity: number;
  categoryId: string;
  organizationId: string;
  status: 'draft' | 'active' | 'inactive' | 'archived';
  featured: boolean;
  tags?: string[];
  specifications?: Record<string, any>;
  variants?: ProductVariant[];
  averageRating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  category?: Category;
  organization?: Organization;
  reviews?: Review[];
  cartItems?: CartItem[];
  orderItems?: OrderItem[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  value: string;
  price?: number;
  sku?: string;
  quantity: number;
  imageUrl?: string;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  featured?: boolean;
  tags?: string[];
  sortBy?: 'name' | 'price' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProductSearchResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

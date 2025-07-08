import type { Product } from './product';
import type { Organization } from './organization';

// Core Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  organizationId: string;
  isActive: boolean;
  sortOrder?: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  parent?: Category;
  children?: Category[];
  products?: Product[];
  organization?: Organization;
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
  level: number;
  isExpanded?: boolean;
}

export interface CategoryFilters {
  search?: string;
  parentId?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'createdAt' | 'sortOrder';
  sortOrder?: 'asc' | 'desc';
}

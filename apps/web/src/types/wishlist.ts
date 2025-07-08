export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    price: number;
    comparePrice?: number;
    status: 'draft' | 'active' | 'inactive' | 'archived';
    isActive: boolean;
    category: {
      id: string;
      name: string;
      slug: string;
    };
  };
  createdAt: Date;
}

export interface AddToWishlistRequest {
  productId: string;
}

export interface WishlistFilters {
  category?: string;
  sortBy?: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'name';
  page?: number;
  limit?: number;
}

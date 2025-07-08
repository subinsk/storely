import { Wishlist, WishlistItem, AddToWishlistRequest, WishlistFilters } from '../types/wishlist';
import { ApiResponse, PaginatedResponse } from '../types';

class WishlistService {
  private baseURL = '/api/wishlist';

  async getWishlist(filters?: WishlistFilters): Promise<ApiResponse<PaginatedResponse<WishlistItem>>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const params = new URLSearchParams();
      if (filters) {
        if (filters.category) params.append('category', filters.category);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
      }

      const response = await fetch(`${this.baseURL}?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to fetch wishlist'
        };
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Get wishlist error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async addToWishlist(item: AddToWishlistRequest): Promise<ApiResponse<WishlistItem>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(`${this.baseURL}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to add item to wishlist'
        };
      }

      return {
        success: true,
        data: data.item,
        message: data.message
      };
    } catch (error) {
      console.error('Add to wishlist error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async removeFromWishlist(itemId: string): Promise<ApiResponse<void>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(`${this.baseURL}/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to remove item from wishlist'
        };
      }

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async clearWishlist(): Promise<ApiResponse<void>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(`${this.baseURL}/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to clear wishlist'
        };
      }

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Clear wishlist error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async isInWishlist(productId: string): Promise<ApiResponse<boolean>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(`${this.baseURL}/check/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to check wishlist'
        };
      }

      return {
        success: true,
        data: data.isInWishlist
      };
    } catch (error) {
      console.error('Check wishlist error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }
}

export const wishlistService = new WishlistService();

import { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest, CartSummary } from '../types/cart';
import { ApiResponse } from '../types';

class CartService {
  private baseURL = '/api/cart';

  async getCart(): Promise<ApiResponse<Cart>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(this.baseURL, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to fetch cart'
        };
      }

      return {
        success: true,
        data: data.cart
      };
    } catch (error) {
      console.error('Get cart error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async addToCart(item: AddToCartRequest): Promise<ApiResponse<CartItem>> {
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
          error: data.error || 'Failed to add item to cart'
        };
      }

      return {
        success: true,
        data: data.item,
        message: data.message
      };
    } catch (error) {
      console.error('Add to cart error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async updateCartItem(update: UpdateCartItemRequest): Promise<ApiResponse<CartItem>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(`${this.baseURL}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(update),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to update cart item'
        };
      }

      return {
        success: true,
        data: data.item,
        message: data.message
      };
    } catch (error) {
      console.error('Update cart item error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async removeFromCart(itemId: string): Promise<ApiResponse<void>> {
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
          error: data.error || 'Failed to remove item from cart'
        };
      }

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Remove from cart error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async clearCart(): Promise<ApiResponse<void>> {
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
          error: data.error || 'Failed to clear cart'
        };
      }

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Clear cart error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async getCartSummary(): Promise<ApiResponse<CartSummary>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(`${this.baseURL}/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to fetch cart summary'
        };
      }

      return {
        success: true,
        data: data.summary
      };
    } catch (error) {
      console.error('Get cart summary error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }
}

export const cartService = new CartService();

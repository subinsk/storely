import { Order, CreateOrderRequest, OrderSummary, OrderTracking } from '../types/order';
import { ApiResponse, PaginatedResponse } from '../types';

class OrderService {
  private baseURL = '/api/orders';

  async createOrder(orderData: CreateOrderRequest): Promise<ApiResponse<Order>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to create order'
        };
      }

      return {
        success: true,
        data: data.order,
        message: data.message
      };
    } catch (error) {
      console.error('Create order error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async getOrders(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Order>>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(`${this.baseURL}?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to fetch orders'
        };
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Get orders error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(`${this.baseURL}/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to fetch order'
        };
      }

      return {
        success: true,
        data: data.order
      };
    } catch (error) {
      console.error('Get order error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async cancelOrder(orderId: string): Promise<ApiResponse<Order>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(`${this.baseURL}/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to cancel order'
        };
      }

      return {
        success: true,
        data: data.order,
        message: data.message
      };
    } catch (error) {
      console.error('Cancel order error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async getOrderSummary(): Promise<ApiResponse<OrderSummary>> {
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
          error: data.error || 'Failed to fetch order summary'
        };
      }

      return {
        success: true,
        data: data.summary
      };
    } catch (error) {
      console.error('Get order summary error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async trackOrder(orderId: string): Promise<ApiResponse<OrderTracking>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(`${this.baseURL}/${orderId}/track`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to track order'
        };
      }

      return {
        success: true,
        data: data.tracking
      };
    } catch (error) {
      console.error('Track order error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }
}

export const orderService = new OrderService();

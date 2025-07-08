import { Review, ReviewSummary, CreateReviewRequest, UpdateReviewRequest, ReviewFilters } from '../types/review';
import { ApiResponse, PaginatedResponse } from '../types';

class ReviewService {
  private baseURL = '/api/reviews';

  async getProductReviews(productId: string, filters?: ReviewFilters): Promise<ApiResponse<PaginatedResponse<Review>>> {
    try {
      const params = new URLSearchParams();
      params.append('productId', productId);
      
      if (filters) {
        if (filters.rating) params.append('rating', filters.rating.toString());
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
      }

      const response = await fetch(`${this.baseURL}?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to fetch reviews'
        };
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Get product reviews error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async getReviewSummary(productId: string): Promise<ApiResponse<ReviewSummary>> {
    try {
      const response = await fetch(`${this.baseURL}/summary/${productId}`);
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to fetch review summary'
        };
      }

      return {
        success: true,
        data: data.summary
      };
    } catch (error) {
      console.error('Get review summary error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async createReview(reviewData: CreateReviewRequest): Promise<ApiResponse<Review>> {
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
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to create review'
        };
      }

      return {
        success: true,
        data: data.review,
        message: data.message
      };
    } catch (error) {
      console.error('Create review error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async updateReview(reviewId: string, reviewData: UpdateReviewRequest): Promise<ApiResponse<Review>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(`${this.baseURL}/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to update review'
        };
      }

      return {
        success: true,
        data: data.review,
        message: data.message
      };
    } catch (error) {
      console.error('Update review error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async deleteReview(reviewId: string): Promise<ApiResponse<void>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(`${this.baseURL}/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to delete review'
        };
      }

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Delete review error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async getUserReviews(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Review>>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(`${this.baseURL}/user?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to fetch user reviews'
        };
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Get user reviews error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async getUserReviewForProduct(productId: string): Promise<ApiResponse<Review | null>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(`${this.baseURL}/user/product/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to fetch user review'
        };
      }

      return {
        success: true,
        data: data.review
      };
    } catch (error) {
      console.error('Get user review for product error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }
}

export const reviewService = new ReviewService();

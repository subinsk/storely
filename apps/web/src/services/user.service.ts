import { UserProfile, UserAddress } from '../types/user';
import { ApiResponse, PaginatedResponse } from '../types';

class UserService {
  private baseURL = '/api/user';

  async getProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(`${this.baseURL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to fetch profile'
        };
      }

      return {
        success: true,
        data: data.profile
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async updateProfile(profileData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(`${this.baseURL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to update profile'
        };
      }

      return {
        success: true,
        data: data.profile,
        message: data.message
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async getAddresses(): Promise<ApiResponse<UserAddress[]>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(`${this.baseURL}/addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to fetch addresses'
        };
      }

      return {
        success: true,
        data: data.addresses
      };
    } catch (error) {
      console.error('Get addresses error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async createAddress(addressData: Omit<UserAddress, 'id'>): Promise<ApiResponse<UserAddress>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(`${this.baseURL}/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to create address'
        };
      }

      return {
        success: true,
        data: data.address,
        message: data.message
      };
    } catch (error) {
      console.error('Create address error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async updateAddress(addressId: string, addressData: Partial<UserAddress>): Promise<ApiResponse<UserAddress>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(`${this.baseURL}/addresses/${addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to update address'
        };
      }

      return {
        success: true,
        data: data.address,
        message: data.message
      };
    } catch (error) {
      console.error('Update address error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async deleteAddress(addressId: string): Promise<ApiResponse<void>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(`${this.baseURL}/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to delete address'
        };
      }

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Delete address error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async setDefaultAddress(addressId: string): Promise<ApiResponse<void>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(`${this.baseURL}/addresses/${addressId}/default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to set default address'
        };
      }

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Set default address error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async uploadAvatar(file: File): Promise<ApiResponse<string>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${this.baseURL}/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to upload avatar'
        };
      }

      return {
        success: true,
        data: data.avatarUrl,
        message: data.message
      };
    } catch (error) {
      console.error('Upload avatar error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  async deleteAccount(): Promise<ApiResponse<void>> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const response = await fetch(`${this.baseURL}/account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to delete account'
        };
      }

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Delete account error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }
}

export const userService = new UserService();
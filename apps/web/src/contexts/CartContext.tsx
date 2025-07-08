'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest, CartSummary } from '../types/cart';
import { cartService } from '../services/cart.service';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  items: CartItem[];
  summary: CartSummary | null;
  isLoading: boolean;
  error: string | null;
  itemCount: number;
  addToCart: (item: AddToCartRequest) => Promise<boolean>;
  updateCartItem: (update: UpdateCartItemRequest) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => Promise<void>;
  refreshSummary: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [summary, setSummary] = useState<CartSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const itemCount = cart?.items?.length || 0;

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
      refreshSummary();
    } else {
      setCart(null);
      setSummary(null);
    }
  }, [isAuthenticated]);

  const refreshCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await cartService.getCart();
      
      if (response.success && response.data) {
        setCart(response.data);
      } else {
        setError(response.error || 'Failed to fetch cart');
      }
    } catch (error) {
      console.error('Refresh cart error:', error);
      setError('Failed to refresh cart');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSummary = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await cartService.getCartSummary();
      
      if (response.success && response.data) {
        setSummary(response.data);
      }
    } catch (error) {
      console.error('Refresh summary error:', error);
    }
  };

  const addToCart = async (item: AddToCartRequest): Promise<boolean> => {
    if (!isAuthenticated) {
      setError('Please login to add items to cart');
      return false;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await cartService.addToCart(item);
      
      if (response.success) {
        await refreshCart();
        await refreshSummary();
        return true;
      } else {
        setError(response.error || 'Failed to add item to cart');
        return false;
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      setError('Failed to add item to cart');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (update: UpdateCartItemRequest): Promise<boolean> => {
    if (!isAuthenticated) {
      setError('Please login to update cart');
      return false;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await cartService.updateCartItem(update);
      
      if (response.success) {
        await refreshCart();
        await refreshSummary();
        return true;
      } else {
        setError(response.error || 'Failed to update cart item');
        return false;
      }
    } catch (error) {
      console.error('Update cart item error:', error);
      setError('Failed to update cart item');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: string): Promise<boolean> => {
    if (!isAuthenticated) {
      setError('Please login to remove items from cart');
      return false;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await cartService.removeFromCart(itemId);
      
      if (response.success) {
        await refreshCart();
        await refreshSummary();
        return true;
      } else {
        setError(response.error || 'Failed to remove item from cart');
        return false;
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
      setError('Failed to remove item from cart');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async (): Promise<boolean> => {
    if (!isAuthenticated) {
      setError('Please login to clear cart');
      return false;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await cartService.clearCart();
      
      if (response.success) {
        setCart(null);
        setSummary(null);
        return true;
      } else {
        setError(response.error || 'Failed to clear cart');
        return false;
      }
    } catch (error) {
      console.error('Clear cart error:', error);
      setError('Failed to clear cart');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: CartContextType = {
    cart,
    items: cart?.items || [],
    summary,
    isLoading,
    error,
    itemCount,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    refreshSummary
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

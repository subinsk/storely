import { useState, useEffect, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApi = <T>(
  apiCall: () => Promise<{ success: boolean; data?: T; error?: string }>,
  dependencies: any[] = []
) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiCall();
      
      if (response.success && response.data) {
        setState({ data: response.data, loading: false, error: null });
      } else {
        setState({ 
          data: null, 
          loading: false, 
          error: response.error || 'An error occurred' 
        });
      }
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Network error' 
      });
    }
  }, dependencies);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
};

export const useApiMutation = <T, Args extends any[]>(
  apiCall: (...args: Args) => Promise<{ success: boolean; data?: T; error?: string; message?: string }>
) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (...args: Args) => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const response = await apiCall(...args);
      
      if (response.success) {
        setState({ data: response.data || null, loading: false, error: null });
        return { success: true, data: response.data, message: response.message };
      } else {
        setState({ 
          data: null, 
          loading: false, 
          error: response.error || 'An error occurred' 
        });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error';
      setState({ 
        data: null, 
        loading: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  }, [apiCall]);

  return { ...state, mutate };
};

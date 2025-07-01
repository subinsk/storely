import useSWR from 'swr';
import { fetcher } from '@/lib/axios';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export const useGetCustomers = () => {
  const { data, error, isLoading, mutate } = useSWR<{
    customers: Customer[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>('/api/customers', fetcher);

  return {
    customers: data?.customers || [],
    pagination: data?.pagination,
    isLoading,
    error,
    mutate,
  };
};

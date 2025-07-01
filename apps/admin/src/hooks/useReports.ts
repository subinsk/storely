import { useMemo } from 'react';
import useSWR from 'swr';

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  period?: string;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
};

export function useSalesReport(filters?: ReportFilters) {
  const searchParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
  }
  
  const url = `/api/reports/sales${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      salesData: data || null,
      salesLoading: isLoading,
      salesError: error,
      refresh: mutate,
    }),
    [data, error, isLoading, mutate]
  );

  return memoizedValue;
}

export function useProductsReport(filters?: ReportFilters) {
  const searchParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
  }
  
  const url = `/api/reports/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      productsData: data || null,
      productsLoading: isLoading,
      productsError: error,
      refresh: mutate,
    }),
    [data, error, isLoading, mutate]
  );

  return memoizedValue;
}

export function useCustomersReport(filters?: ReportFilters) {
  const searchParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
  }
  
  const url = `/api/reports/customers${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      customersData: data || null,
      customersLoading: isLoading,
      customersError: error,
      refresh: mutate,
    }),
    [data, error, isLoading, mutate]
  );

  return memoizedValue;
}

export function useAdvancedReports(type?: string, filters?: ReportFilters) {
  const searchParams = new URLSearchParams();
  if (type) {
    searchParams.append('type', type);
  }
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
  }
  
  const url = `/api/reports/advanced${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      advancedData: data || null,
      advancedLoading: isLoading,
      advancedError: error,
      refresh: mutate,
    }),
    [data, error, isLoading, mutate]
  );

  return memoizedValue;
}

export function useScheduledReports(type?: string) {
  const searchParams = new URLSearchParams();
  if (type) {
    searchParams.append('type', type);
  }
  
  const url = `/api/reports/scheduled${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      scheduledData: data || null,
      scheduledLoading: isLoading,
      scheduledError: error,
      refresh: mutate,
    }),
    [data, error, isLoading, mutate]
  );

  return memoizedValue;
}

// Mutation functions for scheduled reports
export async function createScheduledReport(reportData: any) {
  const response = await fetch('/api/reports/scheduled', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'schedule', ...reportData }),
  });

  if (!response.ok) {
    throw new Error('Failed to create scheduled report');
  }

  return response.json();
}

export async function updateScheduledReport(id: string, reportData: any) {
  const response = await fetch('/api/reports/scheduled', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, ...reportData }),
  });

  if (!response.ok) {
    throw new Error('Failed to update scheduled report');
  }

  return response.json();
}

export async function deleteScheduledReport(id: string) {
  const response = await fetch(`/api/reports/scheduled?id=${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete scheduled report');
  }

  return response.json();
}

export async function executeScheduledReport(reportId: string) {
  const response = await fetch('/api/reports/scheduled', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'execute', reportId }),
  });

  if (!response.ok) {
    throw new Error('Failed to execute report');
  }

  return response.json();
}

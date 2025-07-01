import { useMemo } from 'react';
import useSWR from 'swr';

export interface NotificationFilters {
  type?: 'all' | 'unread' | 'archived';
  notificationType?: string;
  page?: number;
  limit?: number;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  description?: string;
  actionUrl?: string;
  isRead: boolean;
  isArchived: boolean;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
};

export function useNotifications(filters?: NotificationFilters) {
  // Build URL with filters
  const searchParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
  }
  
  const url = `/api/notifications${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      notifications: data?.notifications || [],
      counts: data?.counts || { all: 0, unread: 0, archived: 0 },
      pagination: data?.pagination,
      notificationsLoading: isLoading,
      notificationsError: error,
      notificationsEmpty: !isLoading && !data?.notifications?.length,
      refresh: mutate,
    }),
    [data, error, isLoading, mutate]
  );

  return memoizedValue;
}

// Notification management functions
export const createNotification = async (data: any) => {
  const response = await fetch('/api/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create notification');
  }

  return response.json();
};

export const updateNotifications = async (ids: string[], action: 'mark_read' | 'mark_unread' | 'archive' | 'unarchive') => {
  const response = await fetch('/api/notifications', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids, action }),
  });

  if (!response.ok) {
    throw new Error('Failed to update notifications');
  }

  return response.json();
};

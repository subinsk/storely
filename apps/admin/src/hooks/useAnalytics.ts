'use client';

import { api } from '@storely/shared/lib';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface AnalyticsData {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  growthData: {
    products: number;
    orders: number;
    revenue: number;
    customers: number;
  };
}

export function useAnalytics() {
  const { data: session } = useSession();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      if (!session?.user?.organizationId) {
        setError('No organization selected');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data: analyticsData } = await api.get<AnalyticsData>('/dashboard/analytics', {
          headers: {
            'x-organization-id': session.user.organizationId
          }
        });

        setData(analyticsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [session?.user?.organizationId]);

  return { data, loading, error };
}

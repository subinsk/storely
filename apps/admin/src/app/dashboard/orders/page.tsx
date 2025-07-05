import type { Metadata } from 'next';
import { Suspense } from 'react';
import OrdersView from '@/views/dashboard/orders';

export const dynamic = 'force-dynamic';

// ----------------------------------------------------------------------

export default async function Page() {
  return <OrdersView />;
}

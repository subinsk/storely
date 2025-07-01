'use client';

import OrderDetailsView from '@/views/dashboard/orders/order-details-view';

interface PageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailsPage({ params }: PageProps) {
  return <OrderDetailsView orderId={params.id} />;
}

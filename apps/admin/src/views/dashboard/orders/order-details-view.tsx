import React from 'react';
import { Container, Stack, Typography, Box, Button } from '@mui/material';
import { ArrowBack, Print, Email, Edit } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import {CustomBreadcrumbs} from '@storely/shared/components/custom-breadcrumbs';
import { paths } from '@/routes/paths';
import OrderDetails from '@/sections/order/order-details';
import OrderStatusForm from '@/sections/order/order-status-form';
import { useGetOrders } from '@/services/order.service';

interface OrderDetailsViewProps {
  orderId: string;
}

export default function OrderDetailsView({ orderId }: OrderDetailsViewProps) {
  const router = useRouter();
  const { orderDetails, ordersLoading, ordersError, refresh } = useGetOrders({ id: orderId });

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    // Implement email functionality
    console.log('Send email for order:', orderId);
  };

  const handleEdit = () => {
    // Navigate to edit page or open edit modal
    console.log('Edit order:', orderId);
  };

  if (ordersLoading) {
    return (
      <Container maxWidth="lg">
        <Typography>Loading order details...</Typography>
      </Container>
    );
  }

  if (ordersError || !orderDetails) {
    return (
      <Container maxWidth="lg">
        <Typography color="error">
          {ordersError?.message || 'Order not found'}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading={`Order #${orderDetails.orderNumber}`}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Orders', href: paths.dashboard.orders.root },
          { name: `#${orderDetails.orderNumber}` }
        ]}
        action={
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => router.back()}
            >
              Back
            </Button>
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={handlePrint}
            >
              Print
            </Button>
            <Button
              variant="outlined"
              startIcon={<Email />}
              onClick={handleSendEmail}
            >
              Email
            </Button>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEdit}
            >
              Edit
            </Button>
          </Box>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={3}>
        {/* Order Status Management */}
        <OrderStatusForm 
          order={orderDetails} 
          onUpdate={(updatedOrder) => {
            refresh();
          }}
        />

        {/* Order Details */}
        <OrderDetails order={orderDetails} />
      </Stack>
    </Container>
  );
}

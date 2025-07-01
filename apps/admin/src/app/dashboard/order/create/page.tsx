'use client';

import { useRouter } from 'next/navigation';
import { Container, Typography, Box } from '@mui/material';
import OrderFormSimple from '@/components/order/order-form-simple';

export default function CreateOrderPage() {
  const router = useRouter();

  const handleSuccess = (order: any) => {
    router.push(`/dashboard/order/${order.id}`);
  };

  const handleCancel = () => {
    router.push('/dashboard/orders');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create New Order
        </Typography>
        
        <OrderFormSimple
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </Box>
    </Container>
  );
}

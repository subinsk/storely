'use client';

import React from 'react';
import { Container } from '@mui/material';
import EnhancedProductForm from '@/sections/product/enhanced-product-form';
import { useRouter } from 'next/navigation';

const CreateProductPage: React.FC = () => {
  const router = useRouter();

  const handleSave = (product: any) => {
    router.push(`/dashboard/product/${product.id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Container maxWidth={false}>
      <EnhancedProductForm
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </Container>
  );
};

export default CreateProductPage;

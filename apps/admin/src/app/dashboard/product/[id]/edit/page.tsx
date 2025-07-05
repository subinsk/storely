'use client';

import React from 'react';
import { Container } from '@mui/material';
import EnhancedProductForm from '@/sections/product/enhanced-product-form';
import { useRouter, useParams } from 'next/navigation';

const EditProductPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const handleSave = (product: any) => {
    router.push(`/dashboard/product/${product.id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Container maxWidth={false}>
      <EnhancedProductForm
        productId={productId}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </Container>
  );
};

export default EditProductPage;

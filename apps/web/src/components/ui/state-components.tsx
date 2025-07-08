"use client";

import { Box, Typography, Button, Stack, Container } from "@mui/material";
import { Iconify } from "./iconify";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  imageUrl?: string;
}

export function EmptyState({ title, description, icon = "mdi:inbox-outline", action, imageUrl }: EmptyStateProps) {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 8,
        }}
      >
        {imageUrl ? (
          <Box
            component="img"
            src={imageUrl}
            alt={title}
            sx={{ width: 200, height: 200, mb: 3 }}
          />
        ) : (
          <Iconify 
            icon={icon} 
            sx={{ 
              width: 120, 
              height: 120, 
              color: 'text.disabled',
              mb: 3 
            }} 
          />
        )}
        
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        
        {description && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
            {description}
          </Typography>
        )}
        
        {action && (
          <Button
            variant="contained"
            size="large"
            onClick={action.onClick}
            startIcon={<Iconify icon="mdi:plus" />}
          >
            {action.label}
          </Button>
        )}
      </Box>
    </Container>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorState({ 
  title = "Something went wrong", 
  description = "We encountered an error while loading this content. Please try again.",
  onRetry,
  showRetry = true 
}: ErrorStateProps) {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 8,
        }}
      >
        <Iconify 
          icon="mdi:alert-circle-outline" 
          sx={{ 
            width: 120, 
            height: 120, 
            color: 'error.main',
            mb: 3 
          }} 
        />
        
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
          {description}
        </Typography>
        
        {showRetry && (
          <Button
            variant="contained"
            size="large"
            onClick={onRetry}
            startIcon={<Iconify icon="mdi:refresh" />}
          >
            Try Again
          </Button>
        )}
      </Box>
    </Container>
  );
}

// Specific empty states for different contexts
export function EmptyCartState({ onContinueShopping }: { onContinueShopping: () => void }) {
  return (
    <EmptyState
      title="Your cart is empty"
      description="Looks like you haven't added any items to your cart yet. Start shopping to fill it up!"
      icon="mdi:cart-outline"
      action={{
        label: "Continue Shopping",
        onClick: onContinueShopping,
      }}
    />
  );
}

export function EmptyProductsState({ onAddProduct }: { onAddProduct?: () => void }) {
  return (
    <EmptyState
      title="No products found"
      description="We couldn't find any products matching your search criteria. Try adjusting your filters or browse our categories."
      icon="mdi:package-variant"
      action={onAddProduct ? {
        label: "Add Product",
        onClick: onAddProduct,
      } : undefined}
    />
  );
}

export function EmptyCategoriesState({ onAddCategory }: { onAddCategory?: () => void }) {
  return (
    <EmptyState
      title="No categories found"
      description="Start organizing your products by creating categories."
      icon="mdi:folder-outline"
      action={onAddCategory ? {
        label: "Add Category",
        onClick: onAddCategory,
      } : undefined}
    />
  );
}

export function EmptyOrdersState() {
  return (
    <EmptyState
      title="No orders yet"
      description="You haven't placed any orders yet. Start shopping to see your order history here."
      icon="mdi:receipt-text-outline"
    />
  );
}

export function EmptyWishlistState({ onContinueShopping }: { onContinueShopping: () => void }) {
  return (
    <EmptyState
      title="Your wishlist is empty"
      description="Save items you love to your wishlist. They'll be waiting for you here."
      icon="mdi:heart-outline"
      action={{
        label: "Start Shopping",
        onClick: onContinueShopping,
      }}
    />
  );
}

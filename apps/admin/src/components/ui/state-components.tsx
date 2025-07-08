"use client";

import { Alert, AlertTitle, Box, Button, Container, Stack, Typography } from "@mui/material";
import { Iconify } from "@storely/shared/components/iconify";

interface ErrorStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'error' | 'warning' | 'info';
}

export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while loading the data. Please try again.",
  actionLabel = "Retry",
  onAction,
  variant = 'error'
}: ErrorStateProps) {
  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Alert severity={variant} sx={{ mb: 3 }}>
          <AlertTitle>{title}</AlertTitle>
          {message}
        </Alert>
        {onAction && (
          <Button
            variant="contained"
            startIcon={<Iconify icon="tabler:refresh" />}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </Box>
    </Container>
  );
}

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
}

export function EmptyState({
  title = "No data found",
  message = "There are no items to display.",
  actionLabel = "Add Item",
  onAction,
  icon = "tabler:folder-open"
}: EmptyStateProps) {
  return (
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <Iconify 
        icon={icon} 
        width={80} 
        height={80} 
        sx={{ color: 'text.disabled', mb: 2 }} 
      />
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {message}
      </Typography>
      {onAction && (
        <Button
          variant="contained"
          startIcon={<Iconify icon="tabler:plus" />}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}

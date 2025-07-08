"use client";

import { Box, Card, CardContent, Skeleton, Stack } from "@mui/material";

// Generic loading skeleton for cards
export function CardSkeleton({ 
  height = 200, 
  showActions = false,
  showHeader = true 
}: { 
  height?: number; 
  showActions?: boolean;
  showHeader?: boolean;
}) {
  return (
    <Card>
      {showHeader && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Skeleton variant="text" width="60%" height={24} />
        </Box>
      )}
      <CardContent>
        <Stack spacing={2}>
          <Skeleton variant="rectangular" height={height} />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
          {showActions && (
            <Stack direction="row" spacing={1}>
              <Skeleton variant="rectangular" width={80} height={36} />
              <Skeleton variant="rectangular" width={80} height={36} />
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

// Table row loading skeleton
export function TableRowSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} style={{ padding: 16 }}>
              <Skeleton 
                variant="text" 
                width={colIndex === 0 ? 40 : colIndex === columns - 1 ? 60 : "100%"} 
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// Form loading skeleton
export function FormSkeleton() {
  return (
    <Stack spacing={3}>
      <Skeleton variant="text" width="30%" height={32} />
      <Skeleton variant="rectangular" height={56} />
      <Skeleton variant="rectangular" height={56} />
      <Skeleton variant="rectangular" height={120} />
      <Skeleton variant="rectangular" height={200} />
      <Stack direction="row" spacing={2}>
        <Skeleton variant="rectangular" width={120} height={40} />
        <Skeleton variant="rectangular" width={80} height={40} />
      </Stack>
    </Stack>
  );
}

// Grid loading skeleton
export function GridSkeleton({ 
  items = 6, 
  columns = 3 
}: { 
  items?: number; 
  columns?: number; 
}) {
  return (
    <Box 
      sx={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${columns}, 1fr)`, 
        gap: 2 
      }}
    >
      {Array.from({ length: items }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </Box>
  );
}

// Category tree skeleton
export function CategoryTreeSkeleton() {
  return (
    <Stack spacing={1}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Box key={index} sx={{ pl: index % 2 === 0 ? 0 : 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton variant="text" width={`${60 + Math.random() * 40}%`} />
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

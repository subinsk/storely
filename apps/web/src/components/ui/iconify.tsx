"use client";

import { Icon, IconifyIcon } from '@iconify/react';
import { Box, SxProps, Theme } from '@mui/material';

interface IconifyProps {
  icon: IconifyIcon | string;
  sx?: SxProps<Theme>;
  width?: number | string;
  height?: number | string;
  color?: string;
}

export function Iconify({ icon, sx, width = 24, height = 24, color, ...other }: IconifyProps) {
  return (
    <Box
      component={Icon}
      icon={icon}
      sx={{
        width,
        height,
        color,
        ...sx,
      }}
      {...other}
    />
  );
}

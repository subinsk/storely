import React from 'react';
import { Icon } from '@iconify/react';

interface IconifyProps {
  icon: string;
  width?: number | string;
  height?: number | string;
  color?: string;
  sx?: any;
}

export const Iconify: React.FC<IconifyProps> = ({ 
  icon, 
  width = 24, 
  height = 24, 
  color,
  sx,
  ...other 
}) => {
  return (
    <Icon 
      icon={icon} 
      width={width} 
      height={height} 
      color={color}
      {...other}
    />
  );
};

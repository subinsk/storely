"use client";

import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NavigationButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "text" | "outlined" | "contained";
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
  sx?: any;
  onClick?: () => void;
}

export default function NavigationButton({
  href,
  children,
  variant = "contained",
  color = "primary",
  startIcon,
  endIcon,
  size = "medium",
  fullWidth = false,
  disabled = false,
  sx,
  onClick,
  ...other
}: NavigationButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    
    try {
      if (onClick) {
        await onClick();
      }
      router.push(href);
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      // Keep loading state for a brief moment to show user feedback
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <LoadingButton
      loading={loading}
      variant={variant}
      color={color}
      startIcon={startIcon}
      endIcon={endIcon}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={handleClick}
      sx={sx}
      {...other}
    >
      {children}
    </LoadingButton>
  );
}

import React, { memo, forwardRef } from "react";
import Box from "@mui/material/Box";
import type { BoxProps } from "@mui/material/Box";

// ----------------------------------------------------------------------

export interface ScrollbarProps extends BoxProps {
  children?: React.ReactNode;
  fill?: boolean;
}

const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(
  ({ children, sx, fill = false, ...other }, ref) => {
    const userAgent =
      typeof navigator === "undefined" ? "SSR" : navigator.userAgent;

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );

    // Native scrollbar for mobile
    if (isMobile) {
      return (
        <Box
          ref={ref}
          sx={{
            overflow: "auto",
            ...(fill && {
              height: "100%",
              "& > div": { height: "100%", display: "flex", flexDirection: "column" },
            }),
            '&::-webkit-scrollbar': {
              width: 8,
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'grey.300',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: 'grey.400',
            },
            ...sx,
          }}
          {...other}
        >
          {children}
        </Box>
      );
    }

    // Default: native styled scrollbar for all platforms
    return (
      <Box
        ref={ref}
        sx={{
          overflow: "auto",
          ...(fill && {
            height: "100%",
            "& > div": { height: "100%", display: "flex", flexDirection: "column" },
          }),
          '&::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'grey.300',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'grey.400',
          },
          ...sx,
        }}
        {...other}
      >
        {children}
      </Box>
    );
  }
);

Scrollbar.displayName = "Scrollbar";

export default memo(Scrollbar);

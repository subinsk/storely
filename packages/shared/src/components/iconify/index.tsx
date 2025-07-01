"use client";

import { forwardRef } from "react";
// icons
import { Icon } from "@iconify/react";
// @mui
import Box from "@mui/material/Box";

// ----------------------------------------------------------------------

interface IconifyProps {
  icon: string;
  width?: number;
  sx?: object;
  [key: string]: any;
}

const Iconify = forwardRef<HTMLSpanElement, IconifyProps>(
  ({ icon, width = 20, sx, ...other }, ref) => (
    <Box
      ref={ref}
      component={Icon}
      className="component-iconify"
      icon={icon}
      sx={{ width, height: width, ...sx }}
      {...other}
    />
  )
);

Iconify.displayName = "Iconify";

export default Iconify;

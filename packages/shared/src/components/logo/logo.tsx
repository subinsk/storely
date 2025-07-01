"use client";

import { forwardRef } from "react";
import { useTheme } from "@mui/material/styles";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import type { BoxProps } from "@mui/material/Box";
import Image from "next/image";
// routes
import { RouterLink } from "@/components/router-link";

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
  useSvg?: boolean; // allow switching between SVG and image
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    { disabledLink = false, sx, useSvg = false, ...other },
    ref
  ) => {
    const theme = useTheme();
    // fallback SVG logo
    const svgLogo = (
      <Box
        ref={ref}
        component="div"
        sx={{
          width: 40,
          height: 40,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          ...sx,
        }}
        {...other}
      >
        <svg width="100%" height="100%" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="currentColor" opacity="0.1" />
          <circle cx="20" cy="20" r="12" fill="currentColor" />
          <text x="20" y="26" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
            S
          </text>
        </svg>
      </Box>
    );
    // image logo (from public folder)
    const imageLogo = (
      <Box
        ref={ref}
        sx={{
          width: 40,
          height: 40,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          ...sx,
        }}
        {...other}
      >
        <Image
          src="/logo/logo-colored.png"
          alt="logo"
          style={{ objectFit: "contain" }}
          width={40}
          height={40}
        />
      </Box>
    );
    const logo = useSvg ? svgLogo : imageLogo;
    if (disabledLink) {
      return logo;
    }
    return (
      <Link component={RouterLink} href="/" sx={{ display: "contents" }}>
        {logo}
      </Link>
    );
  }
);

Logo.displayName = "Logo";

export default Logo;

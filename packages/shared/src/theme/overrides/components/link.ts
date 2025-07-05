import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

export function link(theme: any) {
  return {
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none !important',
          '&:hover': {
            textDecoration: 'none !important',
          },
          '&:focus': {
            textDecoration: 'none !important',
          },
          '&:visited': {
            textDecoration: 'none !important',
          },
          '&:active': {
            textDecoration: 'none !important',
          },
          // For any nested elements that might inherit text decoration
          '& *': {
            textDecoration: 'inherit !important',
          },
          // Handle Next.js Link component specifically
          '&[role="link"]': {
            textDecoration: 'none !important',
          },
        },
      },
    },
  };
}

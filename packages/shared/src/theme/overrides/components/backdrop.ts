import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

export function backdrop(theme: any) {
  return {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(theme.palette.grey[900], 0.8),
        },
        invisible: {
          background: "transparent",
        },
      },
    },
  };
}

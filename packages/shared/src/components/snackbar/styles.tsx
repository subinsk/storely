import { MaterialDesignContent } from "notistack";
// @mui
import { styled, alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

import React from "react";

export const StyledNotistack: React.ComponentType<any> = styled(MaterialDesignContent)(
  ({ theme }: { theme: any }) => {
    const isLight = theme.palette.mode === "light";
    const customShadows = theme.customShadows ? theme.customShadows.z8 : theme.shadows[8];
    return {
      "& #notistack-snackbar": {
        ...theme.typography.subtitle2,
        padding: 0,
        flexGrow: 1,
      },
      "&.notistack-MuiContent": {
        padding: theme.spacing(0.5),
        paddingRight: theme.spacing(2),
        color: theme.palette.text.primary,
        boxShadow: customShadows,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
      },
      "&.notistack-MuiContent-default": {
        padding: theme.spacing(1),
        color: isLight ? theme.palette.common.white : theme.palette.grey[800],
        backgroundColor: isLight
          ? theme.palette.grey[800]
          : theme.palette.common.white,
      },
    };
  }
);

// ----------------------------------------------------------------------

interface StyledIconProps {
  color: string;
  theme?: any;
}

export const StyledIcon: React.ComponentType<any> = styled("span")<StyledIconProps>(
  ({ color, theme }) => {
    const paletteColor = theme.palette[color]?.main || theme.palette.primary.main;
    return {
      width: 44,
      height: 44,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing(1.5),
      color: paletteColor,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(paletteColor, 0.16),
    };
  }
);

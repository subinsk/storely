import React, { forwardRef } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import type { BoxProps } from "@mui/material/Box";

// ----------------------------------------------------------------------

const StyledLabel = styled(Box)(({ theme }) => ({
  height: 22,
  minWidth: 22,
  lineHeight: 0,
  borderRadius: 6,
  cursor: "default",
  alignItems: "center",
  whiteSpace: "nowrap",
  display: "inline-flex",
  justifyContent: "center",
  padding: theme.spacing(0, 0.75),
  fontSize: theme.typography.pxToRem(12),
  fontWeight: theme.typography.fontWeightBold,
  transition: theme.transitions.create("all", {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

export interface LabelProps extends BoxProps {
  startIcon?: React.ReactElement | null;
  endIcon?: React.ReactElement | null;
  color?: "default" | "primary" | "secondary" | "info" | "success" | "warning" | "error";
  variant?: "filled" | "outlined" | "ghost" | "soft";
}

const Label = forwardRef<HTMLSpanElement, LabelProps>(
  (
    {
      children,
      color = "default",
      variant = "soft",
      startIcon,
      endIcon,
      sx,
      ...other
    },
    ref
  ) => {
    const iconStyle = {
      width: 16,
      height: 16,
      "& svg, img": { width: 1, height: 1, objectFit: "cover" },
    };
    return (
      <StyledLabel
        ref={ref}
        component="span"
        sx={
          // @ts-ignore: allow palette keys in sx
          ({
            ...(color === "default" && {
              color: "text.primary",
              backgroundColor: "grey.500_16",
            }),
            ...(color === "primary" && {
              color: "primary.main",
              backgroundColor: "primary.lighter",
            }),
            ...(color === "secondary" && {
              color: "secondary.main",
              backgroundColor: "secondary.lighter",
            }),
            ...(color === "info" && {
              color: "info.main",
              backgroundColor: "info.lighter",
            }),
            ...(color === "success" && {
              color: "success.main",
              backgroundColor: "success.lighter",
            }),
            ...(color === "warning" && {
              color: "warning.main",
              backgroundColor: "warning.lighter",
            }),
            ...(color === "error" && {
              color: "error.main",
              backgroundColor: "error.lighter",
            }),
            ...(startIcon && { pl: 0.75 }),
            ...(endIcon && { pr: 0.75 }),
            ...sx,
          })
        }
        {...other}
      >
        {startIcon && <Box sx={{ mr: 0.75, ...iconStyle }}>{startIcon}</Box>}
        {children}
        {endIcon && <Box sx={{ ml: 0.75, ...iconStyle }}>{endIcon}</Box>}
      </StyledLabel>
    );
  }
);

Label.displayName = "Label";

export default Label;

// @mui
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import type { Theme } from "@mui/material/styles";
import type { BoxProps } from "@mui/material/Box";
import type { StyledComponent } from "@emotion/styled";

// ----------------------------------------------------------------------

interface StyledLabelOwnerState {
  color: "default" | "error" | "info" | "primary" | "success" | "warning";
  variant: "filled" | "outlined" | "soft";
}

export const StyledLabel: StyledComponent<BoxProps & { ownerState: StyledLabelOwnerState }> = styled(Box, {
  shouldForwardProp: (prop) => prop !== "ownerState",
})<{
  ownerState: StyledLabelOwnerState;
}>(({ theme, ownerState }: { theme: Theme; ownerState: StyledLabelOwnerState }) => {
  const isLight = theme.palette.mode === "light";
  const filledVariant = ownerState.variant === "filled";
  const outlinedVariant = ownerState.variant === "outlined";
  const softVariant = ownerState.variant === "soft";

  const defaultStyle =
    ownerState.color === "default"
      ? {
          ...(filledVariant && {
            color: isLight ? theme.palette.common.white : theme.palette.grey[800],
            backgroundColor: theme.palette.text.primary,
          }),
          ...(outlinedVariant && {
            backgroundColor: "transparent",
            color: theme.palette.text.primary,
            border: `2px solid ${theme.palette.text.primary}`,
          }),
          ...(softVariant && {
            color: theme.palette.text.secondary,
            backgroundColor: alpha(theme.palette.grey[500], 0.16),
          }),
        }
      : {};

  const colorStyle =
    ownerState.color !== "default"
      ? {
          ...(filledVariant && {
            color: theme.palette[ownerState.color].contrastText,
            backgroundColor: theme.palette[ownerState.color].main,
          }),
          ...(outlinedVariant && {
            backgroundColor: "transparent",
            color: theme.palette[ownerState.color].main,
            border: `2px solid ${theme.palette[ownerState.color].main}`,
          }),
          ...(softVariant && {
            color: theme.palette[ownerState.color][isLight ? "dark" : "light"],
            backgroundColor: alpha(theme.palette[ownerState.color].main, 0.16),
          }),
        }
      : {};

  return {
    height: 24,
    minWidth: 24,
    lineHeight: 0,
    borderRadius: 6,
    cursor: "default",
    alignItems: "center",
    whiteSpace: "nowrap",
    display: "inline-flex",
    justifyContent: "center",
    textTransform: "capitalize",
    padding: theme.spacing(0, 0.75),
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightBold,
    transition: theme.transitions.create("all", {
      duration: theme.transitions.duration.shorter,
    }),
    ...defaultStyle,
    ...colorStyle,
  };
});

import React, { FC } from "react";
import { alpha, styled } from "@mui/material/styles";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemButton from "@mui/material/ListItemButton";

// ----------------------------------------------------------------------

interface StyledItemProps {
  active: boolean;
  depth: number;
  config: any;
  theme?: any;
  children?: React.ReactNode;
  disableGutters?: boolean;
  disableSticky?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const StyledItem: FC<StyledItemProps> = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "depth" && prop !== "config",
})<StyledItemProps>(
  ({ active, depth, config, theme }) => {
    const subItem = depth !== 1;
    const deepSubItem = depth > 2;

    const activeStyles = {
      root: {
        color:
          theme.palette.mode === "light"
            ? theme.palette.primary.main
            : theme.palette.primary.light,
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.16),
        },
      },
      sub: {
        color: theme.palette.text.primary,
        backgroundColor: "transparent",
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
      },
    };

    return {
      padding: config.itemPadding,
      marginBottom: config.itemGap,
      borderRadius: config.itemRadius,
      minHeight: config.itemRootHeight,
      color: theme.palette.text.secondary,
      ...(active && {
        ...activeStyles.root,
      }),
      ...(subItem && {
        minHeight: config.itemSubHeight,
        ...(active && {
          ...activeStyles.sub,
        }),
      }),
      ...(deepSubItem && {
        paddingLeft: theme.spacing(depth),
      }),
    };
  }
);

// ----------------------------------------------------------------------

interface StyledIconProps {
  size: number;
  children?: React.ReactNode;
}

export const StyledIcon: FC<StyledIconProps> = styled(ListItemIcon)<StyledIconProps>(
  ({ size }) => ({
    width: size,
    height: size,
    alignItems: "center",
    justifyContent: "center",
  })
);

interface StyledDotIconProps {
  active: boolean;
  theme?: any;
  children?: React.ReactNode;
}

export const StyledDotIcon: FC<StyledDotIconProps> = styled("span")<StyledDotIconProps>(
  ({ active, theme }) => ({
    width: 4,
    height: 4,
    borderRadius: "50%",
    backgroundColor: theme.palette.text.disabled,
    transition: theme.transitions.create(["transform"], {
      duration: theme.transitions.duration.shorter,
    }),
    ...(active && {
      transform: "scale(2)",
      backgroundColor: theme.palette.primary.main,
    }),
  })
);

// ----------------------------------------------------------------------

interface StyledSubheaderProps {
  config: any;
  theme?: any;
  children?: React.ReactNode;
  onClick?: () => void;
  disableGutters?: boolean;
  disableSticky?: boolean;
}

export const StyledSubheader: FC<StyledSubheaderProps> = styled(ListSubheader)<StyledSubheaderProps>(
  ({ config, theme }) => ({
    ...theme.typography.overline,
    fontSize: 11,
    cursor: "pointer",
    display: "inline-flex",
    padding: config.itemPadding,
    paddingTop: theme.spacing(2),
    marginBottom: config.itemGap,
    paddingBottom: theme.spacing(1),
    color: theme.palette.text.disabled,
    transition: theme.transitions.create(["color"], {
      duration: theme.transitions.duration.shortest,
    }),
    "&:hover": {
      color: theme.palette.text.primary,
    },
  })
);

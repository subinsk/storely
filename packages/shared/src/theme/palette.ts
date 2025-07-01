"use client";

import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

// SETUP COLORS

// MODERN GRAYSCALE
const GREY = {
  0: "#FFFFFF",
  100: "#F8F9FA",    // Ultra light
  200: "#F1F3F4",    // Very light
  300: "#E8EAED",    // Light
  400: "#DADCE0",    // Light medium
  500: "#9AA0A6",    // Medium
  600: "#5F6368",    // Dark medium
  700: "#3C4043",    // Dark
  800: "#202124",    // Very dark
  900: "#111827",    // Ultra dark
};

// FURNITURE-INSPIRED BRAND COLORS
const PRIMARY = {
  lighter: "#FFF4E6", // Light wood/cream
  light: "#D4A574",   // Light oak
  main: "#8B4513",    // Rich saddle brown (furniture wood)
  dark: "#6B3410",    // Dark walnut
  darker: "#4A240B",  // Deep mahogany
  contrastText: "#FFFFFF",
};

const SECONDARY = {
  lighter: "#F5F7FA", // Light gray (modern furniture)
  light: "#B8C4CE",   // Mid gray
  main: "#556B7D",    // Slate blue-gray (contemporary)
  dark: "#3A4A5C",    // Dark slate
  darker: "#253038",  // Charcoal
  contrastText: "#FFFFFF",
};

const INFO = {
  lighter: "#E3F2FD", // Light blue
  light: "#64B5F6",   // Medium blue
  main: "#1976D2",    // Professional blue
  dark: "#1565C0",    // Dark blue
  darker: "#0D47A1",  // Deep blue
  contrastText: "#FFFFFF",
};

const SUCCESS = {
  lighter: "#E8F5E8", // Light green
  light: "#81C784",   // Medium green
  main: "#4CAF50",    // Success green
  dark: "#388E3C",    // Dark green
  darker: "#2E7D32",  // Deep green
  contrastText: "#FFFFFF",
};

const WARNING = {
  lighter: "#FFF8E1", // Light amber
  light: "#FFD54F",   // Medium amber
  main: "#FF9800",    // Warm orange
  dark: "#F57C00",    // Dark orange
  darker: "#E65100",  // Deep orange
  contrastText: "#FFFFFF",
};

const ERROR = {
  lighter: "#FFEBEE", // Light red
  light: "#EF5350",   // Medium red
  main: "#F44336",    // Error red
  dark: "#D32F2F",    // Dark red
  darker: "#B71C1C",  // Deep red
  contrastText: "#FFFFFF",
};

const COMMON = {
  common: {
    black: "#000000",
    white: "#FFFFFF",
  },
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  divider: alpha(GREY[500], 0.2),
  action: {
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

export interface Palette {
  [x: string]: any;
  mode: "light" | "dark";
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  background: {
    paper: string;
    default: string;
    neutral: string;
  };
  action: {
    hover: string;
    selected: string;
    disabled: string;
    disabledBackground: string;
    focus: string;
    hoverOpacity: number;
    disabledOpacity: number;
    active: string;
  };
}

export function palette(mode: "light" | "dark"): Palette {
  const light: Palette = {
    ...COMMON,
    mode: "light",
    text: {
      primary: GREY[800],
      secondary: GREY[600],
      disabled: GREY[500],
    },
    background: {
      paper: "#FFFFFF",
      default: "#FFFFFF",
      neutral: GREY[200],
    },
    action: {
      ...COMMON.action,
      active: GREY[600],
    },
  };

  const dark: Palette = {
    ...COMMON,
    mode: "dark",
    text: {
      primary: "#FFFFFF",
      secondary: GREY[500],
      disabled: GREY[600],
    },
    background: {
      paper: GREY[800],
      default: GREY[900],
      neutral: alpha(GREY[500], 0.12),
    },
    action: {
      ...COMMON.action,
      active: GREY[500],
    },
  };

  return mode === "light" ? light : dark;
}

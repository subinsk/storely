import { palette } from "../palette";
import { shadows } from "../shadows";
import { customShadows, Shadows } from "../custom-shadows";

// ----------------------------------------------------------------------

export function darkMode(mode: "light" | "dark"): {
  palette: ReturnType<typeof palette>;
  shadows: ReturnType<typeof shadows>;
  customShadows: Shadows;
} {
  const theme = {
    palette: palette(mode),
    shadows: shadows(mode),
    customShadows: customShadows(mode),
  };

  return theme;
}

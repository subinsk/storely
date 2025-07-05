//
import { menuItem } from "../../css";

// ----------------------------------------------------------------------

export function menu(theme: any) {
  return {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          ...menuItem(theme),
        },
      },
    },
  };
}

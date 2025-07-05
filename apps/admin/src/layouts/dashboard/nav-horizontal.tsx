import { memo } from "react";
// @mui
import { SxProps, Theme, useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
// theme
import { bgBlur } from "@storely/shared/theme/css";
// hooks
import { useSession } from "next-auth/react";
// components
import { NavSectionHorizontal } from "@storely/shared/components/nav-section";
//
import { HEADER } from "../config-layout";
import { useNavData } from "./config-navigation";
import { HeaderShadow } from "../_common";

// ----------------------------------------------------------------------

function NavHorizontal() {
  const theme = useTheme();

  const { data: session } = useSession();
  const user = session?.user;

  const navData = useNavData();

  return (
    <AppBar
      component="nav"
      sx={{
        top: HEADER.H_DESKTOP_OFFSET,
      }}
    >
      <Toolbar
        sx={{
          ...(bgBlur({
            color: theme.palette.background.default,
          }) as SxProps<Theme>),
        }}
      >
        <NavSectionHorizontal
          data={navData}
          config={{
            currentRole: user?.role || "admin",
          }}
        />
      </Toolbar>

      <HeaderShadow />
    </AppBar>
  );
}

export default memo(NavHorizontal);

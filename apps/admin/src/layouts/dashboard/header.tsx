import PropTypes from "prop-types";
// @mui
import { SxProps, Theme, useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
// theme
import { bgBlur } from "@storely/shared/theme/css";
// hooks
import { useOffSetTop } from "@/hooks/use-off-set-top";
import { useResponsive } from "@/hooks/use-responsive";
// components
import {Logo} from "@storely/shared/components/logo";
import SvgColor from "@storely/shared/components/svg-color";
import { useSettingsContext } from "@storely/shared/components/settings";
//
import { HEADER, NAV } from "../config-layout";
import {
  Searchbar,
  AccountPopover,
  SettingsButton,
  LanguagePopover,
  ContactsPopover,
  NotificationsPopover,
} from "../_common";

// ----------------------------------------------------------------------

export default function Header({ onOpenNav }: { onOpenNav: () => void }) {
  const theme: any = useTheme();

  const settings: any = useSettingsContext();

  const isNavHorizontal = settings.themeLayout === "horizontal";

  const isNavMini = settings.themeLayout === "mini";

  const lgUp = useResponsive("up", "lg");

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;

  const renderContent = (
    <>
      {lgUp && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}

      {!lgUp && (
        <IconButton onClick={onOpenNav}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}

      {/* <Searchbar /> */}

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1 }}
      >
        {/* <LanguagePopover /> */}

        {/* <NotificationsPopover /> */}

        {/* <ContactsPopover /> */}

        {/* <SettingsButton /> */}

        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={
        {
          height: HEADER.H_MOBILE,
          zIndex: theme.zIndex.appBar + 1,
          ...bgBlur({
            color: theme.palette.background.default,
          }),
          transition: theme.transitions.create(["height", "box-shadow"], {
            duration: theme.transitions.duration.shorter,
          }),
          boxShadow: offsetTop ? '0 4px 20px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.05)',
          borderBottom: offsetTop ? 'none' : `1px solid ${theme.palette.divider}`,
          ...(lgUp && {
            width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
            height: HEADER.H_DESKTOP,
            ...(offsetTop && {
              height: HEADER.H_DESKTOP_OFFSET,
            }),
            ...(isNavHorizontal && {
              width: 1,
              bgcolor: "background.default",
              height: HEADER.H_DESKTOP_OFFSET,
              borderBottom: `1px solid ${theme.palette.divider}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }),
            ...(isNavMini && {
              width: `calc(100% - ${NAV.W_MINI + 1}px)`,
            }),
          }),
        } as SxProps<Theme>
      }
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

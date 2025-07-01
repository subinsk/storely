import PropTypes from "prop-types";
// @mui
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
// hooks
import { useResponsive } from "@/hooks/use-responsive";
// theme
import { bgBlur } from "@/theme/css";
// components
import Iconify from "@/components/iconify";
import { useSettingsContext } from "@/components/settings";
//
import { NAV } from "../config-layout";

// ----------------------------------------------------------------------

export default function NavToggleButton({
  sx,
  ...other
}: {
  sx?: any;
  [x: string]: any;
}) {
  const theme: any = useTheme();

  const settings: any = useSettingsContext();

  const lgUp = useResponsive("up", "lg");

  if (!lgUp) {
    return null;
  }

  return (
    <IconButton
      size="small"
      onClick={() =>
        settings.onUpdate(
          "themeLayout",
          settings.themeLayout === "vertical" ? "mini" : "vertical"
        )
      }
      sx={{
        p: 0.5,
        top: 32,
        position: "fixed",
        left: NAV.W_VERTICAL - 12,
        zIndex: theme.zIndex.appBar + 1,
        border: `dashed 1px ${theme.palette.divider}`,
        ...bgBlur({ opacity: 0.48, color: theme.palette.background.default }),
        "&:hover": {
          bgcolor: "background.default",
        },
        ...sx,
      }}
      {...other}
    >
      <Iconify
        width={16}
        icon={
          settings.themeLayout === "vertical"
            ? "eva:arrow-ios-back-fill"
            : "eva:arrow-ios-forward-fill"
        }
      />
    </IconButton>
  );
}

NavToggleButton.propTypes = {
  sx: PropTypes.object,
};

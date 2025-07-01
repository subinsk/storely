import PropTypes from "prop-types";
import { useEffect } from "react";
// @mui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
// hooks
import { useResponsive } from "@/hooks/use-responsive";
// components
import Logo from "@/components/logo";
import Scrollbar from "@/components/scrollbar";
import { NavSectionVertical } from "@/components/nav-section";
//
import { NAV } from "../config-layout";
import { useNavData } from "./config-navigation";
import { NavToggleButton, NavUpgrade } from "../_common";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ROLE_LABEL_MAP } from "@/constants/role-label-map";

// ----------------------------------------------------------------------

export default function NavVertical({
  openNav,
  onCloseNav,
}: {
  openNav: any;
  onCloseNav: any;
}) {
  const { data: session } = useSession();
  const user = session?.user;

  const pathname = usePathname();

  const lgUp = useResponsive("up", "lg");

  const navData = useNavData();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ px: 2.5, pt: 3, pb:2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Logo />
      </Box>

      <NavSectionVertical
        data={navData}
        config={{
          currentRole: user?.role || "admin",
        }}
        sx={{ px: 2}}
      />

      <Box sx={{ flexGrow: 1 }} />

      {/* User info section at bottom */}
      {user && (
        <Box 
          sx={{ 
            px: 2.5, 
            py: 2, 
            borderTop: '1px solid', 
            borderColor: 'divider',
            backgroundColor: 'grey.50',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </Box>
            <Stack sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="subtitle2" noWrap>
                {user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {ROLE_LABEL_MAP[user?.role ?? "org_user"]}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      )}
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: "fixed",
            width: NAV.W_VERTICAL,
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
            backgroundColor: 'background.paper',
            boxShadow: '4px 0 24px rgba(0,0,0,0.06)',
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

NavVertical.propTypes = {
  onCloseNav: PropTypes.func,
  openNav: PropTypes.bool,
};

// @mui
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
// hooks
import { useResponsive } from "@/hooks/use-responsive";
import { usePathname } from "next/navigation";
// components
import { useSettingsContext } from "@storely/shared/components/settings";
import { CustomBreadcrumbs } from "@storely/shared/components/custom-breadcrumbs";
import { paths } from "@/routes/paths";
//
import { HEADER, NAV } from "../config-layout";

// ----------------------------------------------------------------------

const SPACING = 8;

export default function Main({
  children,
  sx,
  categoryName,
  productName,
  customBreadcrumbs,
  ...other
}: {
  children: React.ReactNode;
  sx?: object;
  categoryName?: string;
  productName?: string;
  customBreadcrumbs?: any[];
}) {
  const settings: any = useSettingsContext();
  const pathname = usePathname();

  const lgUp = useResponsive("up", "lg");

  const isNavHorizontal = settings.themeLayout === "horizontal";

  const isNavMini = settings.themeLayout === "mini";

  const renderContent = (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs 
          autogenerate={true}
          pathname={pathname}
          categoryName={categoryName}
          productName={productName}
          customItems={customBreadcrumbs}
          dashboardPaths={paths.dashboard}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
      </Container>
      {children}
    </>
  );

  if (isNavHorizontal) {
    return (
      <Box
        component="main"
        sx={{
          minHeight: 1,
          display: "flex",
          flexDirection: "column",
          pt: `${HEADER.H_MOBILE + 24}px`,
          pb: 10,
          ...(lgUp && {
            pt: `${HEADER.H_MOBILE * 2 + 40}px`,
            pb: 15,
          }),
        }}
      >
        {renderContent}
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        display: "flex",
        flexDirection: "column",
        py: `${HEADER.H_DESKTOP + SPACING}px`,
        ...(lgUp && {
          px: 2,
          py: `${HEADER.H_DESKTOP + SPACING}px`,
          width: `calc(100% - ${NAV.W_VERTICAL}px)`,
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI}px)`,
          }),
        }),
        ...sx,
      }}
      {...other}
    >
      {renderContent}
    </Box>
  );
}

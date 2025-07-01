"use client";

// @mui
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
// hooks
import { useResponsive } from "@/hooks/use-responsive";
// theme
import { bgGradient } from "@/theme/css";
// components
import Logo from "@/components/logo";

// ----------------------------------------------------------------------

export default function AuthLayout({
  children,
  image,
  title,
}: {
  children: React.ReactNode;
  image?: string;
  title?: string;
}) {
  const theme = useTheme();

  const upMd = useResponsive("up", "md");

  const renderLogo = (
    <Logo
      sx={{
        zIndex: 9,
        position: "absolute",
        m: { xs: 2, md: 5 },
      }}
    />
  );

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        m: "auto",
        maxWidth: 480,
        px: { xs: 2, md: 8 },
        py: { xs: 4, md: 12 },
      }}
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      spacing={10}
      sx={{
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === "light" ? 0.88 : 0.94
          ),
          imgUrl: "/assets/background/overlay_2.jpg",
        }),
      }}
    >
      <Typography variant="h3" sx={{ maxWidth: 480, textAlign: "center" }}>
        {title || "Hi, Welcome back"}
      </Typography>

      <Box
        component="img"
        alt="auth"
        src={image || "/assets/illustrations/illustration_dashboard.png"}
        sx={{ maxWidth: 500 }}
      />
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: "100vh",
      }}
    >
      {renderLogo}

      {upMd && renderSection}

      {renderContent}
    </Stack>
  );
}

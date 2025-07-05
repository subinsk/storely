"use client";

import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useResponsive } from "@/hooks/use-responsive";
import { bgGradient } from "@storely/shared/theme/css";
import {Logo} from "@storely/shared/components/logo";

// ----------------------------------------------------------------------

export default function AuthLayout({
  children,
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
        position: "absolute",
        top: { xs: 16, md: 32 },
        left: { xs: 16, md: 32 },
        zIndex: 9,
      }}
    />
  );

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 4, textAlign: "center" }}>
      <Typography variant="h3" fontWeight={700} color="primary.main">
        Welcome Back
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Sign in to Furnerio to continue
      </Typography>
    </Stack>
  );

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        maxWidth: 420,
        mx: "auto",
        px: { xs: 2, md: 4 },
        py: { xs: 8, md: 12 },
        minHeight: "100vh",
        justifyContent: "center",
      }}
    >
      {renderHead}
      {children}
    </Stack>
  );

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        position: "relative",
        ...bgGradient({
          color: alpha(theme.palette.grey[100], 0.8),
          imgUrl: "/assets/background/overlay_1.jpg",
        }),
      }}
    >
      {renderLogo}
      {renderContent}
    </Box>
  );
}

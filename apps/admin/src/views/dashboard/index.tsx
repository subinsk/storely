"use client";

import Iconify from "@/components/iconify";
import AnalyticsDashboard from "@/components/analytics/analytics-dashboard";
import ConfigurationOverview from "@/components/dashboard/configuration-overview";
import SystemStatusOverview from "@/components/dashboard/system-status-overview";
import { paths } from "@/routes/paths";
import { Card, Stack, Typography, Box, Grid, CircularProgress, Alert } from "@mui/material";
import Link from "@/routes/components/router-link";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function DashboardView() {
  const { data: analyticsData, loading, error } = useAnalytics();

  // Quick action items
  const quickActions = [
    {
      title: "Categories",
      icon: "category",
      href: paths.dashboard.categories.root,
      description: "Manage product categories",
      color: "primary",
    },
    {
      title: "Products",
      icon: "building-store",
      href: paths.dashboard.products.root,
      description: "Add and manage products",
      color: "info",
    },
    {
      title: "Orders",
      icon: "truck-delivery",
      href: paths.dashboard.orders.root,
      description: "Process customer orders",
      color: "success",
    },
    {
      title: "Analytics",
      icon: "chart-bar",
      href: paths.dashboard.analytics,
      description: "View detailed analytics",
      color: "warning",
    },
    {
      title: "System Logs",
      icon: "file-text",
      href: paths.dashboard.system.logs,
      description: "Monitor system activity",
      color: "info",
    },
    {
      title: "Security",
      icon: "shield-check",
      href: paths.dashboard.security.auditLogs,
      description: "Security & audit logs",
      color: "error",
    },
    {
      title: "Integrations",
      icon: "plug",
      href: paths.dashboard.integrations,
      description: "Manage integrations",
      color: "secondary",
    },
    {
      title: "Admin Settings",
      icon: "settings",
      href: paths.dashboard.settings.admin,
      description: "Configure system settings",
      color: "secondary",
    },
    {
      title: "Payment Setup",
      icon: "credit-card",
      href: paths.dashboard.payment.configuration,
      description: "Configure payment methods",
      color: "primary",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here&apos;s what&apos;s happening with your store today
        </Typography>
      </Box>

      {/* Analytics Dashboard */}
      <Box sx={{ mb: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : analyticsData ? (
          <AnalyticsDashboard {...analyticsData} />
        ) : null}
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          {quickActions.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                component={Link}
                href={item.href}
                sx={{
                  display: "block", // Ensures Card fills grid cell when rendered as <a>
                  height: 160,
                  padding: 3,
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px -4px rgba(145, 158, 171, 0.12), 0 0 0 1px rgba(145, 158, 171, 0.05)",
                  },
                }}
              >
                <Stack spacing={2} height="100%">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      bgcolor: `${item.color}.lighter`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Iconify 
                      icon={`tabler:${item.icon}`} 
                      width={24} 
                      sx={{ color: `${item.color}.main` }}
                    />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Configuration Overview */}
      <Box sx={{ mb: 4 }}>
        <ConfigurationOverview />
      </Box>

      {/* System Status Overview */}
      <SystemStatusOverview />
    </Box>
  );
}

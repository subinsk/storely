'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Alert,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import Iconify from '@/components/iconify';

interface SettingItem {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  category: 'security' | 'system' | 'compliance' | 'integrations';
  icon: string;
  critical?: boolean;
}

const defaultSettings: SettingItem[] = [
  {
    id: 'audit_logging',
    title: 'Audit Logging',
    description: 'Track all administrative actions and security events',
    enabled: true,
    category: 'security',
    icon: 'solar:document-text-outline',
    critical: true,
  },
  {
    id: 'two_factor_auth',
    title: 'Two-Factor Authentication',
    description: 'Require 2FA for admin accounts',
    enabled: true,
    category: 'security',
    icon: 'solar:shield-check-outline',
    critical: true,
  },
  {
    id: 'gdpr_compliance',
    title: 'GDPR Compliance Mode',
    description: 'Enable GDPR data protection features',
    enabled: true,
    category: 'compliance',
    icon: 'solar:document-outline',
    critical: true,
  },
  {
    id: 'system_monitoring',
    title: 'System Monitoring',
    description: 'Monitor system performance and health',
    enabled: true,
    category: 'system',
    icon: 'solar:chart-outline',
  },
  {
    id: 'automated_backups',
    title: 'Automated Backups',
    description: 'Schedule automatic database backups',
    enabled: true,
    category: 'system',
    icon: 'solar:database-outline',
    critical: true,
  },
  {
    id: 'api_integrations',
    title: 'API Integrations',
    description: 'Enable third-party API integrations',
    enabled: false,
    category: 'integrations',
    icon: 'solar:link-outline',
  },
  {
    id: 'webhook_notifications',
    title: 'Webhook Notifications',
    description: 'Send notifications via webhooks',
    enabled: false,
    category: 'integrations',
    icon: 'solar:bell-outline',
  },
  {
    id: 'data_encryption',
    title: 'Data Encryption',
    description: 'Encrypt sensitive data at rest',
    enabled: true,
    category: 'security',
    icon: 'solar:lock-outline',
    critical: true,
  },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<SettingItem[]>(defaultSettings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleSettingChange = (id: string, enabled: boolean) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === id ? { ...setting, enabled } : setting
      )
    );
  };

  const handleSaveSettings = () => {
    // In a real app, this would make an API call
    console.log('Saving settings:', settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const filteredSettings = selectedCategory === 'all' 
    ? settings 
    : settings.filter(setting => setting.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'security': return 'error';
      case 'system': return 'primary';
      case 'compliance': return 'warning';
      case 'integrations': return 'info';
      default: return 'default';
    }
  };

  const categories = [
    { value: 'all', label: 'All Settings' },
    { value: 'security', label: 'Security' },
    { value: 'system', label: 'System' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'integrations', label: 'Integrations' },
  ];

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Admin Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure system security, compliance, and integration settings
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleSaveSettings}
          startIcon={<Iconify icon="solar:diskette-outline" />}
        >
          Save Changes
        </Button>
      </Stack>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Filter by Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary">
              {filteredSettings.length} settings found
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {filteredSettings.map((setting) => (
          <Grid item xs={12} md={6} key={setting.id}>
            <Card 
              sx={{ 
                height: '100%',
                border: setting.critical ? '1px solid' : 'none',
                borderColor: setting.critical ? 'error.main' : 'transparent',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          bgcolor: `${getCategoryColor(setting.category)}.lighter`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Iconify 
                          icon={setting.icon}
                          width={24}
                          sx={{ color: `${getCategoryColor(setting.category)}.main` }}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                          <Typography variant="h6">
                            {setting.title}
                          </Typography>
                          {setting.critical && (
                            <Chip
                              label="Critical"
                              size="small"
                              color="error"
                              variant="outlined"
                            />
                          )}
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {setting.description}
                        </Typography>
                      </Box>
                    </Stack>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={setting.enabled}
                          onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
                          color={getCategoryColor(setting.category) as any}
                        />
                      }
                      label=""
                      sx={{ m: 0 }}
                    />
                  </Stack>

                  <Divider />

                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Chip
                      label={setting.category.charAt(0).toUpperCase() + setting.category.slice(1)}
                      size="small"
                      color={getCategoryColor(setting.category) as any}
                      variant="outlined"
                    />
                    <Typography 
                      variant="caption" 
                      color={setting.enabled ? 'success.main' : 'text.secondary'}
                    >
                      {setting.enabled ? 'Enabled' : 'Disabled'}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredSettings.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Iconify icon="solar:settings-outline" width={64} sx={{ color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No settings found
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Try adjusting your filters to see more settings
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

"use client";

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Stack,
  Avatar,
  IconButton,
  Divider,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  Tab,
  Tabs,
  InputAdornment,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import Iconify from '@/components/iconify';
import { Upload } from '@/components/upload';

// ----------------------------------------------------------------------

interface StoreSettingsData {
  storeName: string;
  storeUrl: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  currency: string;
  timezone: string;
  language: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  businessHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function StoreSettingsForm() {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, watch, setValue } = useForm<StoreSettingsData>({
    defaultValues: {
      storeName: 'Storely Furniture',
      storeUrl: 'https://storely.com',
      primaryColor: '#8B4513',
      secondaryColor: '#556B7D',
      fontFamily: 'Inter',
      currency: 'USD',
      timezone: 'UTC',
      language: 'en',
      socialMedia: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
      },
      businessHours: {
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '17:00', closed: false },
        saturday: { open: '10:00', close: '16:00', closed: false },
        sunday: { open: '10:00', close: '16:00', closed: true },
      },
    },
  });

  const primaryColor = watch('primaryColor');
  const secondaryColor = watch('secondaryColor');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const onSubmit = async (data: StoreSettingsData) => {
    setLoading(true);
    try {
      // API call to save store settings
      console.log('Store Settings:', data);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock API call
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const colorPresets = [
    { name: 'Furniture Brown', primary: '#8B4513', secondary: '#556B7D' },
    { name: 'Ocean Blue', primary: '#1976D2', secondary: '#42A5F5' },
    { name: 'Forest Green', primary: '#388E3C', secondary: '#66BB6A' },
    { name: 'Sunset Orange', primary: '#F57C00', secondary: '#FFB74D' },
    { name: 'Purple', primary: '#7B1FA2', secondary: '#BA68C8' },
    { name: 'Crimson Red', primary: '#C62828', secondary: '#EF5350' },
  ];

  const tabs = [
    { label: 'General', icon: 'eva:settings-2-fill' },
    { label: 'Branding', icon: 'eva:color-palette-fill' },
    { label: 'SEO', icon: 'eva:search-fill' },
    { label: 'Contact', icon: 'eva:phone-fill' },
    { label: 'Business Hours', icon: 'eva:clock-fill' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Store Settings
      </Typography>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            {tabs.map((tab, index) => (
              <Tab
                key={tab.label}
                icon={<Iconify icon={tab.icon} />}
                label={tab.label}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* General Settings */}
          <TabPanel value={currentTab} index={0}>
            <Stack spacing={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="storeName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Store Name"
                        placeholder="Enter your store name"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify icon="eva:home-fill" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="storeUrl"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Store URL"
                        placeholder="https://yourstore.com"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify icon="eva:link-fill" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Currency"
                        placeholder="USD"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify icon="eva:credit-card-fill" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="language"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Default Language"
                        placeholder="en"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify icon="eva:globe-fill" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
          </TabPanel>

          {/* Branding */}
          <TabPanel value={currentTab} index={1}>
            <Stack spacing={4}>
              {/* Logo Upload */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Store Logo
                </Typography>
                <Upload
                  file={watch('logo')}
                  onDrop={(files) => setValue('logo', files[0] as any)}
                  accept={{ 'image/*': [] }}
                  placeholder="Upload your store logo"
                />
              </Box>

              {/* Color Schemes */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Color Scheme
                </Typography>
                <Grid container spacing={2}>
                  {colorPresets.map((preset) => (
                    <Grid item key={preset.name}>
                      <Box
                        onClick={() => {
                          setValue('primaryColor', preset.primary);
                          setValue('secondaryColor', preset.secondary);
                        }}
                        sx={{
                          cursor: 'pointer',
                          p: 1,
                          borderRadius: 1,
                          border: '2px solid',
                          borderColor: 
                            primaryColor === preset.primary ? 'primary.main' : 'transparent',
                          '&:hover': { borderColor: 'primary.main' },
                        }}
                      >
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              bgcolor: preset.primary,
                            }}
                          />
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              bgcolor: preset.secondary,
                            }}
                          />
                        </Stack>
                        <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                          {preset.name}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Custom Colors */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="primaryColor"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Primary Color"
                        type="color"
                        InputProps={{
                          startAdornment: (
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: primaryColor,
                                mr: 1,
                              }}
                            />
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="secondaryColor"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Secondary Color"
                        type="color"
                        InputProps={{
                          startAdornment: (
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: secondaryColor,
                                mr: 1,
                              }}
                            />
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
          </TabPanel>

          {/* SEO Settings */}
          <TabPanel value={currentTab} index={2}>
            <Stack spacing={3}>
              <Alert severity="info" icon={<Iconify icon="eva:info-fill" />}>
                These settings help your store appear better in search engine results
              </Alert>
              
              <Controller
                name="metaTitle"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Meta Title"
                    placeholder="Your Store Name - High Quality Furniture"
                    helperText="Appears in search results and browser tabs"
                  />
                )}
              />
              
              <Controller
                name="metaDescription"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label="Meta Description"
                    placeholder="Discover premium furniture for your home..."
                    helperText="Brief description that appears in search results"
                  />
                )}
              />
              
              <Controller
                name="metaKeywords"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Meta Keywords"
                    placeholder="furniture, home decor, modern furniture"
                    helperText="Comma-separated keywords for SEO"
                  />
                )}
              />
            </Stack>
          </TabPanel>

          {/* Contact Information */}
          <TabPanel value={currentTab} index={3}>
            <Stack spacing={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="contactEmail"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Contact Email"
                        type="email"
                        placeholder="info@yourstore.com"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify icon="eva:email-fill" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="contactPhone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Contact Phone"
                        placeholder="+1 (555) 123-4567"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify icon="eva:phone-fill" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label="Business Address"
                    placeholder="123 Main Street, City, State 12345"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="eva:pin-fill" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Divider />

              <Typography variant="subtitle2">Social Media Links</Typography>
              <Grid container spacing={2}>
                {Object.entries(watch('socialMedia') || {}).map(([platform, url]) => (
                  <Grid item xs={12} sm={6} key={platform}>
                    <Controller
                      name={`socialMedia.${platform}` as any}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                          placeholder={`https://${platform}.com/yourstore`}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Iconify icon={`eva:${platform}-fill`} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </TabPanel>

          {/* Business Hours */}
          <TabPanel value={currentTab} index={4}>
            <Stack spacing={3}>
              <Typography variant="subtitle2">Operating Hours</Typography>
              {Object.entries(watch('businessHours') || {}).map(([day, hours]) => (
                <Card key={day} variant="outlined">
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Typography variant="subtitle2" sx={{ minWidth: 100 }}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </Typography>
                      <Controller
                        name={`businessHours.${day}.closed` as any}
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={<Switch {...field} checked={field.value} />}
                            label="Closed"
                          />
                        )}
                      />
                      {!hours.closed && (
                        <>
                          <Controller
                            name={`businessHours.${day}.open` as any}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                type="time"
                                label="Open"
                                size="small"
                              />
                            )}
                          />
                          <Controller
                            name={`businessHours.${day}.close` as any}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                type="time"
                                label="Close"
                                size="small"
                              />
                            )}
                          />
                        </>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </TabPanel>

          {/* Action Buttons */}
          <Box sx={{ p: 3, bgcolor: 'background.neutral' }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" size="large">
                Preview Changes
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                loading={loading}
                loadingPosition="start"
                startIcon={<Iconify icon="eva:save-fill" />}
              >
                Save Settings
              </LoadingButton>
            </Stack>
          </Box>
        </form>
      </Card>
    </Box>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
  Alert,
  Divider,
  Paper,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Store as StoreIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  ContactMail as ContactIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon,
  CloudUpload as UploadIcon,
  Preview as PreviewIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { ChromePicker } from 'react-color';
import {
  storeSettingsService,
  useStoreSettings,
  type StoreSettingsFormData
} from '@/services/store-settings.service';

interface StoreSettingsManagementProps {
  organizationId: string;
}

const StoreSettingsManagement: React.FC<StoreSettingsManagementProps> = ({
  organizationId
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { settings, isLoading, error, mutate } = useStoreSettings(organizationId);
  
  const [formData, setFormData] = useState<StoreSettingsFormData>(
    storeSettingsService.getDefaultSettings(organizationId)
  );
  const [saving, setSaving] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState<{
    primary: boolean;
    secondary: boolean;
  }>({ primary: false, secondary: false });

  // Initialize form data when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData({
        organizationId: settings.organizationId,
        storeName: settings.storeName,
        storeUrl: settings.storeUrl || '',
        logo: settings.logo || '',
        favicon: settings.favicon || '',
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        fontFamily: settings.fontFamily,
        currency: settings.currency,
        timezone: settings.timezone,
        language: settings.language,
        metaTitle: settings.metaTitle || '',
        metaDescription: settings.metaDescription || '',
        metaKeywords: settings.metaKeywords || '',
        socialMediaLinks: settings.socialMediaLinks || {},
        contactInfo: settings.contactInfo || {},
        businessHours: settings.businessHours || {}
      });
    }
  }, [settings]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof StoreSettingsFormData],
        [field]: value
      }
    }));
  };

  const handleBusinessHoursChange = (day: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours?.[day],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (settings) {
        await storeSettingsService.updateStoreSettings(formData);
      } else {
        await storeSettingsService.saveStoreSettings(formData);
      }
      
      await mutate();
      enqueueSnackbar('Store settings saved successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error saving store settings:', error);
      enqueueSnackbar('Failed to save store settings', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (settings) {
      setFormData({
        organizationId: settings.organizationId,
        storeName: settings.storeName,
        storeUrl: settings.storeUrl || '',
        logo: settings.logo || '',
        favicon: settings.favicon || '',
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        fontFamily: settings.fontFamily,
        currency: settings.currency,
        timezone: settings.timezone,
        language: settings.language,
        metaTitle: settings.metaTitle || '',
        metaDescription: settings.metaDescription || '',
        metaKeywords: settings.metaKeywords || '',
        socialMediaLinks: settings.socialMediaLinks || {},
        contactInfo: settings.contactInfo || {},
        businessHours: settings.businessHours || {}
      });
    } else {
      setFormData(storeSettingsService.getDefaultSettings(organizationId));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading store settings...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load store settings. Please try again.
      </Alert>
    );
  }

  const currencies = storeSettingsService.getCurrencies();
  const timezones = storeSettingsService.getTimezones();
  const languages = storeSettingsService.getLanguages();
  const fontFamilies = storeSettingsService.getFontFamilies();

  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 
    'friday', 'saturday', 'sunday'
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <StoreIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Store Settings
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <LoadingButton
            variant="contained"
            startIcon={<SaveIcon />}
            loading={saving}
            onClick={handleSave}
            size="large"
          >
            Save Settings
          </LoadingButton>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
            size="large"
          >
            Reset
          </Button>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            size="large"
            disabled
          >
            Preview Store
          </Button>
        </Box>

        {/* Basic Store Information */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StoreIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Basic Information</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Store Name"
                  value={formData.storeName}
                  onChange={(e) => handleInputChange('storeName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Store URL"
                  value={formData.storeUrl}
                  onChange={(e) => handleInputChange('storeUrl', e.target.value)}
                  placeholder="https://mystore.com"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Logo URL"
                  value={formData.logo}
                  onChange={(e) => handleInputChange('logo', e.target.value)}
                  placeholder="https://example.com/logo.png"
                  InputProps={{
                    endAdornment: (
                      <IconButton size="small">
                        <UploadIcon />
                      </IconButton>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Favicon URL"
                  value={formData.favicon}
                  onChange={(e) => handleInputChange('favicon', e.target.value)}
                  placeholder="https://example.com/favicon.ico"
                />
              </Grid>
              {formData.logo && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle2">Logo Preview:</Typography>
                    <Avatar
                      src={formData.logo}
                      alt="Store Logo"
                      sx={{ width: 64, height: 64 }}
                      variant="rounded"
                    />
                  </Box>
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Appearance Settings */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PaletteIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Appearance & Branding</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Primary Color
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: formData.primaryColor,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      cursor: 'pointer'
                    }}
                    onClick={() => setShowColorPicker(prev => ({ ...prev, primary: !prev.primary }))}
                  />
                  <TextField
                    value={formData.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    size="small"
                    sx={{ flexGrow: 1 }}
                  />
                </Box>
                {showColorPicker.primary && (
                  <Box sx={{ position: 'absolute', zIndex: 2, mt: 1 }}>
                    <Box
                      sx={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }}
                      onClick={() => setShowColorPicker(prev => ({ ...prev, primary: false }))}
                    />
                    <ChromePicker
                      color={formData.primaryColor}
                      onChange={(color) => handleInputChange('primaryColor', color.hex)}
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Secondary Color
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: formData.secondaryColor,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      cursor: 'pointer'
                    }}
                    onClick={() => setShowColorPicker(prev => ({ ...prev, secondary: !prev.secondary }))}
                  />
                  <TextField
                    value={formData.secondaryColor}
                    onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                    size="small"
                    sx={{ flexGrow: 1 }}
                  />
                </Box>
                {showColorPicker.secondary && (
                  <Box sx={{ position: 'absolute', zIndex: 2, mt: 1 }}>
                    <Box
                      sx={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }}
                      onClick={() => setShowColorPicker(prev => ({ ...prev, secondary: false }))}
                    />
                    <ChromePicker
                      color={formData.secondaryColor}
                      onChange={(color) => handleInputChange('secondaryColor', color.hex)}
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Font Family</InputLabel>
                  <Select
                    value={formData.fontFamily}
                    onChange={(e) => handleInputChange('fontFamily', e.target.value)}
                    label="Font Family"
                  >
                    {fontFamilies.map((font) => (
                      <MenuItem key={font.value} value={font.value}>
                        <span style={{ fontFamily: font.value }}>{font.label}</span>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Localization Settings */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LanguageIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Localization</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    label="Currency"
                  >
                    {currencies.map((currency) => (
                      <MenuItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name} ({currency.code})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={formData.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    label="Timezone"
                  >
                    {timezones.map((tz) => (
                      <MenuItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={formData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    label="Language"
                  >
                    {languages.map((lang) => (
                      <MenuItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* SEO Settings */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SearchIcon sx={{ mr: 1 }} />
              <Typography variant="h6">SEO Settings</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meta Title"
                  value={formData.metaTitle}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                  helperText="Recommended: 50-60 characters"
                  inputProps={{ maxLength: 60 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Meta Description"
                  value={formData.metaDescription}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  helperText="Recommended: 150-160 characters"
                  inputProps={{ maxLength: 160 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meta Keywords"
                  value={formData.metaKeywords}
                  onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                  helperText="Comma-separated keywords"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Contact Information */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ContactIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Contact Information</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.contactInfo?.phone || ''}
                  onChange={(e) => handleNestedChange('contactInfo', 'phone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.contactInfo?.email || ''}
                  onChange={(e) => handleNestedChange('contactInfo', 'email', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.contactInfo?.address || ''}
                  onChange={(e) => handleNestedChange('contactInfo', 'address', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.contactInfo?.city || ''}
                  onChange={(e) => handleNestedChange('contactInfo', 'city', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="State"
                  value={formData.contactInfo?.state || ''}
                  onChange={(e) => handleNestedChange('contactInfo', 'state', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Country"
                  value={formData.contactInfo?.country || ''}
                  onChange={(e) => handleNestedChange('contactInfo', 'country', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Zip Code"
                  value={formData.contactInfo?.zipCode || ''}
                  onChange={(e) => handleNestedChange('contactInfo', 'zipCode', e.target.value)}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Social Media Links
            </Typography>
            <Grid container spacing={3}>
              {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map((platform) => (
                <Grid item xs={12} md={6} key={platform}>
                  <TextField
                    fullWidth
                    label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                    value={formData.socialMediaLinks?.[platform] || ''}
                    onChange={(e) => handleNestedChange('socialMediaLinks', platform, e.target.value)}
                    placeholder={`https://${platform}.com/yourpage`}
                  />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Business Hours */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ScheduleIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Business Hours</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {daysOfWeek.map((day) => (
                <Grid item xs={12} key={day}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ minWidth: 100, textTransform: 'capitalize' }}
                    >
                      {day}
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!formData.businessHours?.[day]?.closed}
                          onChange={(e) =>
                            handleBusinessHoursChange(day, 'closed', !e.target.checked)
                          }
                        />
                      }
                      label="Open"
                    />
                    <TextField
                      type="time"
                      label="Open"
                      value={formData.businessHours?.[day]?.open || '09:00'}
                      onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                      disabled={formData.businessHours?.[day]?.closed}
                      size="small"
                      sx={{ minWidth: 120 }}
                    />
                    <TextField
                      type="time"
                      label="Close"
                      value={formData.businessHours?.[day]?.close || '17:00'}
                      onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                      disabled={formData.businessHours?.[day]?.closed}
                      size="small"
                      sx={{ minWidth: 120 }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Box>
  );
};

export default StoreSettingsManagement;

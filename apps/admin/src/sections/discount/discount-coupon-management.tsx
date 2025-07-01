"use client";

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  FormControl,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Box,
  Tab,
  Tabs,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  FormGroup,
  Checkbox,
  InputAdornment
} from '@mui/material';
import {
  LocalOffer,
  Discount,
  Event,
  Add,
  Edit,
  Delete,
  ContentCopy,
  Visibility,
  BarChart,
  Percent,
  AttachMoney,
  ShoppingCart,
  Person,
  CalendarToday
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSnackbar } from 'notistack';
import { format, addDays } from 'date-fns';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y';
  value: number;
  minimumAmount?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  usageLimitPerCustomer?: number;
  startDate: Date;
  endDate?: Date;
  enabled: boolean;
  conditions: {
    products?: string[];
    categories?: string[];
    customers?: string[];
    customerGroups?: string[];
    excludeProducts?: string[];
    excludeCategories?: string[];
  };
  buyXGetY?: {
    buyQuantity: number;
    getQuantity: number;
    getDiscount: number;
  };
}

interface PromotionalCampaign {
  id: string;
  name: string;
  description: string;
  type: 'flash_sale' | 'seasonal' | 'bulk_discount' | 'first_purchase' | 'loyalty';
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  conditions: {
    minimumQuantity?: number;
    minimumAmount?: number;
    customerSegment?: string;
    productCategories?: string[];
  };
  startDate: Date;
  endDate: Date;
  enabled: boolean;
  priority: number;
  usageCount: number;
  conversionRate: number;
}

const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME20',
    name: 'Welcome Discount',
    description: '20% off for new customers',
    type: 'percentage',
    value: 20,
    minimumAmount: 50,
    maximumDiscount: 100,
    usageLimit: 1000,
    usageCount: 234,
    usageLimitPerCustomer: 1,
    startDate: new Date(),
    endDate: addDays(new Date(), 30),
    enabled: true,
    conditions: {
      customerGroups: ['new_customers']
    }
  },
  {
    id: '2',
    code: 'FREESHIP',
    name: 'Free Shipping',
    description: 'Free shipping on orders over $75',
    type: 'free_shipping',
    value: 0,
    minimumAmount: 75,
    usageLimit: undefined,
    usageCount: 1567,
    startDate: new Date(),
    enabled: true,
    conditions: {}
  },
  {
    id: '3',
    code: 'BUY2GET1',
    name: 'Buy 2 Get 1 Free',
    description: 'Buy 2 items, get 1 free from selected categories',
    type: 'buy_x_get_y',
    value: 0,
    usageCount: 89,
    startDate: new Date(),
    endDate: addDays(new Date(), 14),
    enabled: true,
    conditions: {
      categories: ['electronics', 'clothing']
    },
    buyXGetY: {
      buyQuantity: 2,
      getQuantity: 1,
      getDiscount: 100
    }
  }
];

const mockCampaigns: PromotionalCampaign[] = [
  {
    id: '1',
    name: 'Black Friday Sale',
    description: 'Massive discounts across all categories',
    type: 'flash_sale',
    discountType: 'percentage',
    discountValue: 40,
    conditions: {
      minimumAmount: 100
    },
    startDate: new Date('2024-11-29'),
    endDate: new Date('2024-12-02'),
    enabled: true,
    priority: 1,
    usageCount: 2450,
    conversionRate: 15.6
  },
  {
    id: '2',
    name: 'Summer Collection',
    description: 'Special prices on summer items',
    type: 'seasonal',
    discountType: 'percentage',
    discountValue: 25,
    conditions: {
      productCategories: ['summer_wear', 'accessories']
    },
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    enabled: false,
    priority: 2,
    usageCount: 1200,
    conversionRate: 12.3
  }
];

export default function DiscountCouponManagement() {
  const [tabValue, setTabValue] = useState(0);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [campaigns, setCampaigns] = useState<PromotionalCampaign[]>(mockCampaigns);
  const [couponDialog, setCouponDialog] = useState(false);
  const [campaignDialog, setCampaignDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<PromotionalCampaign | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCouponToggle = (couponId: string) => {
    setCoupons(prev => prev.map(coupon => 
      coupon.id === couponId 
        ? { ...coupon, enabled: !coupon.enabled }
        : coupon
    ));
    enqueueSnackbar('Coupon status updated', { variant: 'success' });
  };

  const handleCampaignToggle = (campaignId: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, enabled: !campaign.enabled }
        : campaign
    ));
    enqueueSnackbar('Campaign status updated', { variant: 'success' });
  };

  const handleCopyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    enqueueSnackbar('Coupon code copied to clipboard', { variant: 'success' });
  };

  const getCouponTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent />;
      case 'fixed_amount': return <AttachMoney />;
      case 'free_shipping': return <LocalOffer />;
      case 'buy_x_get_y': return <ShoppingCart />;
      default: return <Discount />;
    }
  };

  const getCouponTypeColor = (type: string) => {
    switch (type) {
      case 'percentage': return 'primary';
      case 'fixed_amount': return 'success';
      case 'free_shipping': return 'info';
      case 'buy_x_get_y': return 'warning';
      default: return 'default';
    }
  };

  const formatCouponValue = (coupon: Coupon) => {
    switch (coupon.type) {
      case 'percentage':
        return `${coupon.value}% off`;
      case 'fixed_amount':
        return `$${coupon.value} off`;
      case 'free_shipping':
        return 'Free shipping';
      case 'buy_x_get_y':
        return `Buy ${coupon.buyXGetY?.buyQuantity} Get ${coupon.buyXGetY?.getQuantity}`;
      default:
        return 'Discount';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Discount & Coupon Management
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab 
            label="Coupons" 
            icon={<LocalOffer />} 
            iconPosition="start"
          />
          <Tab 
            label="Promotional Campaigns" 
            icon={<Event />} 
            iconPosition="start"
          />
          <Tab 
            label="Analytics" 
            icon={<BarChart />} 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Coupons Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Coupon Codes</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  setSelectedCoupon(null);
                  setCouponDialog(true);
                }}
              >
                Create Coupon
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Coupon</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Usage</TableCell>
                    <TableCell>Valid Until</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">
                            {coupon.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" fontFamily="monospace">
                              {coupon.code}
                            </Typography>
                            <IconButton 
                              size="small" 
                              onClick={() => handleCopyCouponCode(coupon.code)}
                            >
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {coupon.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={getCouponTypeIcon(coupon.type)}
                          label={coupon.type.replace('_', ' ')} 
                          size="small" 
                          color={getCouponTypeColor(coupon.type)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {formatCouponValue(coupon)}
                        </Typography>
                        {coupon.minimumAmount && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Min. order: ${coupon.minimumAmount}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {coupon.usageCount} / {coupon.usageLimit || '∞'}
                        </Typography>
                        {coupon.usageLimit && (
                          <Box sx={{ mt: 0.5, width: 60, height: 4, bgcolor: 'grey.200', borderRadius: 1 }}>
                            <Box 
                              sx={{ 
                                width: `${(coupon.usageCount / coupon.usageLimit) * 100}%`, 
                                height: '100%', 
                                bgcolor: 'primary.main', 
                                borderRadius: 1 
                              }} 
                            />
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        {coupon.endDate ? (
                          <Typography variant="body2">
                            {format(coupon.endDate, 'MMM dd, yyyy')}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No expiry
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={coupon.enabled}
                          onChange={() => handleCouponToggle(coupon.id)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedCoupon(coupon);
                            setCouponDialog(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Promotional Campaigns Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6">Promotional Campaigns</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  setSelectedCampaign(null);
                  setCampaignDialog(true);
                }}
              >
                Create Campaign
              </Button>
            </Box>
          </Grid>

          {campaigns.map((campaign) => (
            <Grid item xs={12} md={6} lg={4} key={campaign.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Event color="primary" />
                    <Typography variant="h6" sx={{ ml: 1, flex: 1 }}>
                      {campaign.name}
                    </Typography>
                    <Chip 
                      label={campaign.enabled ? 'Active' : 'Inactive'} 
                      color={campaign.enabled ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {campaign.description}
                  </Typography>

                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {campaign.discountValue}% discount
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {campaign.type.replace('_', ' ')} campaign
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Campaign Period
                      </Typography>
                      <Typography variant="body2">
                        {format(campaign.startDate, 'MMM dd')} - {format(campaign.endDate, 'MMM dd, yyyy')}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Usage
                        </Typography>
                        <Typography variant="body2">
                          {campaign.usageCount}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Conversion
                        </Typography>
                        <Typography variant="body2">
                          {campaign.conversionRate}%
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={campaign.enabled} 
                            onChange={() => handleCampaignToggle(campaign.id)}
                          />
                        }
                        label="Active"
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setCampaignDialog(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalOffer color="primary" />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Active Coupons
                  </Typography>
                </Box>
                <Typography variant="h4">
                  {coupons.filter(c => c.enabled).length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  out of {coupons.length} total
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Person color="success" />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Total Usage
                  </Typography>
                </Box>
                <Typography variant="h4">
                  {coupons.reduce((sum, c) => sum + c.usageCount, 0)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  coupon redemptions
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoney color="warning" />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Avg. Discount
                  </Typography>
                </Box>
                <Typography variant="h4">
                  $24.50
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  per order
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BarChart color="info" />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Conversion Rate
                  </Typography>
                </Box>
                <Typography variant="h4">
                  12.8%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  coupon to purchase
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Performing Coupons
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Coupon Code</TableCell>
                        <TableCell>Usage Count</TableCell>
                        <TableCell>Conversion Rate</TableCell>
                        <TableCell>Total Discount</TableCell>
                        <TableCell>Revenue Impact</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {coupons.slice(0, 5).map((coupon) => (
                        <TableRow key={coupon.id}>
                          <TableCell>{coupon.code}</TableCell>
                          <TableCell>{coupon.usageCount}</TableCell>
                          <TableCell>8.5%</TableCell>
                          <TableCell>$2,450</TableCell>
                          <TableCell>+$12,300</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Coupon Creation/Edit Dialog */}
      <Dialog 
        open={couponDialog} 
        onClose={() => setCouponDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedCoupon ? 'Edit' : 'Create'} Coupon
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Coupon Code"
                defaultValue={selectedCoupon?.code || ''}
                fullWidth
                placeholder="e.g., WELCOME20"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Coupon Name"
                defaultValue={selectedCoupon?.name || ''}
                fullWidth
                placeholder="e.g., Welcome Discount"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                defaultValue={selectedCoupon?.description || ''}
                fullWidth
                multiline
                rows={2}
                placeholder="Brief description of the coupon"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Discount Type</InputLabel>
                <Select
                  defaultValue={selectedCoupon?.type || 'percentage'}
                  label="Discount Type"
                >
                  <MenuItem value="percentage">Percentage Discount</MenuItem>
                  <MenuItem value="fixed_amount">Fixed Amount</MenuItem>
                  <MenuItem value="free_shipping">Free Shipping</MenuItem>
                  <MenuItem value="buy_x_get_y">Buy X Get Y</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Discount Value"
                type="number"
                defaultValue={selectedCoupon?.value || ''}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Minimum Order Amount"
                type="number"
                defaultValue={selectedCoupon?.minimumAmount || ''}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Usage Limit"
                type="number"
                defaultValue={selectedCoupon?.usageLimit || ''}
                fullWidth
                placeholder="Leave empty for unlimited"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Start Date"
                value={selectedCoupon?.startDate || new Date()}
                onChange={() => {}}
                slotProps={{
                  textField: {
                    fullWidth: true
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="End Date (Optional)"
                value={selectedCoupon?.endDate || null}
                onChange={() => {}}
                slotProps={{
                  textField: {
                    fullWidth: true
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCouponDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained">
            {selectedCoupon ? 'Update' : 'Create'} Coupon
          </Button>
        </DialogActions>
      </Dialog>

      {/* Campaign Creation/Edit Dialog */}
      <Dialog 
        open={campaignDialog} 
        onClose={() => setCampaignDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedCampaign ? 'Edit' : 'Create'} Campaign
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Campaign Name"
                defaultValue={selectedCampaign?.name || ''}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                defaultValue={selectedCampaign?.description || ''}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Campaign Type</InputLabel>
                <Select
                  defaultValue={selectedCampaign?.type || 'flash_sale'}
                  label="Campaign Type"
                >
                  <MenuItem value="flash_sale">Flash Sale</MenuItem>
                  <MenuItem value="seasonal">Seasonal</MenuItem>
                  <MenuItem value="bulk_discount">Bulk Discount</MenuItem>
                  <MenuItem value="first_purchase">First Purchase</MenuItem>
                  <MenuItem value="loyalty">Loyalty Program</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Discount Value"
                type="number"
                defaultValue={selectedCampaign?.discountValue || ''}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Start Date"
                value={selectedCampaign?.startDate || new Date()}
                onChange={() => {}}
                slotProps={{
                  textField: {
                    fullWidth: true
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="End Date"
                value={selectedCampaign?.endDate || addDays(new Date(), 7)}
                onChange={() => {}}
                slotProps={{
                  textField: {
                    fullWidth: true
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Priority"
                type="number"
                defaultValue={selectedCampaign?.priority || 1}
                fullWidth
                helperText="Higher priority campaigns will be applied first"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCampaignDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained">
            {selectedCampaign ? 'Update' : 'Create'} Campaign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

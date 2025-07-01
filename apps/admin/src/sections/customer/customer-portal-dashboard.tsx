"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Button,
  Chip,
  Stack,
  Divider,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { format } from 'date-fns';
import { fCurrency, fNumber } from '@/utils/format-number';
import Iconify from '@/components/iconify';
import Image from '@/components/image';

interface CustomerData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  isActive: boolean;
  createdAt: string;
  statistics: {
    totalOrders: number;
    totalSpent: number;
    recentOrders: number;
  };
  orders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    shippingStatus: string;
    total: number;
    createdAt: string;
    items: Array<{
      id: string;
      quantity: number;
      price: number;
      product: {
        id: string;
        name: string;
        images: string[];
      };
    }>;
  }>;
  addresses: Array<{
    id: string;
    type: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`customer-portal-tabpanel-${index}`}
      aria-labelledby={`customer-portal-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function getStatusColor(status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  const statusMap: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
    pending: 'warning',
    confirmed: 'info',
    processing: 'primary',
    shipped: 'success',
    delivered: 'success',
    cancelled: 'error',
    paid: 'success',
    failed: 'error',
    refunded: 'warning',
    preparing: 'info',
    in_transit: 'primary',
    returned: 'warning'
  };
  return statusMap[status.toLowerCase()] || 'default';
}

export default function CustomerPortalDashboard({ customerId }: { customerId: string }) {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CustomerData['orders'][0] | null>(null);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');

  useEffect(() => {
    fetchCustomerData();
  }, [customerId]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/customer-portal?customerId=${customerId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch customer data');
      }

      const data = await response.json();
      setCustomerData(data.customer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTrackOrder = (order: CustomerData['orders'][0]) => {
    setSelectedOrder(order);
    setTrackingDialogOpen(true);
  };

  const handleSubmitSupport = async () => {
    try {
      // Simulate support ticket submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSupportDialogOpen(false);
      setSupportMessage('');
      // Show success message
    } catch (err) {
      console.error('Support submission error:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading customer dashboard...
        </Typography>
      </Box>
    );
  }

  if (error || !customerData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error || 'Customer data not found'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
            <Avatar
              sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
            >
              {customerData.firstName[0]}{customerData.lastName[0]}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" gutterBottom>
                Welcome back, {customerData.firstName}!
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {customerData.email}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip 
                  label={customerData.isActive ? 'Active Account' : 'Inactive'} 
                  color={customerData.isActive ? 'success' : 'error'}
                  size="small"
                />
                <Chip 
                  label={`Member since ${format(new Date(customerData.createdAt), 'MMM yyyy')}`}
                  variant="outlined"
                  size="small"
                />
              </Stack>
            </Box>

            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:message-circle-outline" />}
              onClick={() => setSupportDialogOpen(true)}
            >
              Contact Support
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'primary.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Iconify icon="eva:shopping-cart-outline" width={24} height={24} color="primary.main" />
                </Box>
                <Box>
                  <Typography variant="h3" component="div">
                    {fNumber(customerData.statistics.totalOrders)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'success.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Iconify icon="eva:dollar-sign-outline" width={24} height={24} color="success.main" />
                </Box>
                <Box>
                  <Typography variant="h3" component="div">
                    {fCurrency(customerData.statistics.totalSpent)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Spent
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'info.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Iconify icon="eva:clock-outline" width={24} height={24} color="info.main" />
                </Box>
                <Box>
                  <Typography variant="h3" component="div">
                    {fNumber(customerData.statistics.recentOrders)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recent Orders (30d)
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="customer portal tabs">
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="eva:list-outline" />
                  <span>Order History</span>
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="eva:navigation-2-outline" />
                  <span>Track Orders</span>
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="eva:person-outline" />
                  <span>Profile</span>
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="eva:pin-outline" />
                  <span>Addresses</span>
                </Stack>
              }
            />
          </Tabs>
        </Box>

        {/* Order History Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Order History
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order Number</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customerData.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Typography variant="subtitle2">
                        #{order.orderNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {order.items.slice(0, 3).map((item, index) => (
                          <Tooltip key={item.id} title={item.product.name}>
                            <Box>
                              <Image
                                src={item.product.images[0] || '/assets/placeholder.svg'}
                                alt={item.product.name}
                                sx={{ width: 40, height: 40, borderRadius: 1 }}
                              />
                            </Box>
                          </Tooltip>
                        ))}
                        {order.items.length > 3 && (
                          <Typography variant="body2" color="text.secondary">
                            +{order.items.length - 3} more
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Chip 
                          label={order.status} 
                          color={getStatusColor(order.status)} 
                          size="small" 
                        />
                        <Chip 
                          label={order.paymentStatus} 
                          color={getStatusColor(order.paymentStatus)} 
                          size="small" 
                          variant="outlined"
                        />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {fCurrency(order.total)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleTrackOrder(order)}
                        >
                          <Iconify icon="eva:navigation-2-outline" />
                        </IconButton>
                        <IconButton size="small">
                          <Iconify icon="eva:download-outline" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Track Orders Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Active Orders Tracking
          </Typography>
          <Grid container spacing={3}>
            {customerData.orders
              .filter(order => !['delivered', 'cancelled'].includes(order.status.toLowerCase()))
              .map((order) => (
                <Grid item xs={12} md={6} key={order.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="start" sx={{ mb: 2 }}>
                        <Box>
                          <Typography variant="subtitle1" gutterBottom>
                            Order #{order.orderNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                          </Typography>
                        </Box>
                        <Chip 
                          label={order.shippingStatus} 
                          color={getStatusColor(order.shippingStatus)} 
                          size="small"
                        />
                      </Stack>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Order Progress
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={
                            order.status === 'pending' ? 20 :
                            order.status === 'confirmed' ? 40 :
                            order.status === 'processing' ? 60 :
                            order.status === 'shipped' ? 80 :
                            order.status === 'delivered' ? 100 : 0
                          }
                          sx={{ height: 8, borderRadius: 1 }}
                        />
                      </Box>

                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2">
                          Total: {fCurrency(order.total)}
                        </Typography>
                        <Button
                          size="small"
                          startIcon={<Iconify icon="eva:eye-outline" />}
                          onClick={() => handleTrackOrder(order)}
                        >
                          Track
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </TabPanel>

        {/* Profile Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Profile Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Personal Information
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      label="First Name"
                      value={customerData.firstName}
                      fullWidth
                      disabled
                    />
                    <TextField
                      label="Last Name"
                      value={customerData.lastName}
                      fullWidth
                      disabled
                    />
                    <TextField
                      label="Email"
                      value={customerData.email}
                      fullWidth
                      disabled
                    />
                    <TextField
                      label="Phone"
                      value={customerData.phone || 'Not provided'}
                      fullWidth
                      disabled
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Account Settings
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      label="Date of Birth"
                      value={customerData.dateOfBirth ? format(new Date(customerData.dateOfBirth), 'MMM dd, yyyy') : 'Not provided'}
                      fullWidth
                      disabled
                    />
                    <TextField
                      label="Member Since"
                      value={format(new Date(customerData.createdAt), 'MMM dd, yyyy')}
                      fullWidth
                      disabled
                    />
                    <Alert severity="info">
                      To update your profile information, please contact customer support.
                    </Alert>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Addresses Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Saved Addresses
          </Typography>
          <Grid container spacing={3}>
            {customerData.addresses.map((address) => (
              <Grid item xs={12} md={6} key={address.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="start" sx={{ mb: 2 }}>
                      <Typography variant="subtitle1">
                        {address.type === 'shipping' ? 'Shipping' : 'Billing'} Address
                      </Typography>
                      {address.isDefault && (
                        <Chip label="Default" color="primary" size="small" />
                      )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {address.street}<br />
                      {address.city}, {address.state} {address.zipCode}<br />
                      {address.country}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Card>

      {/* Order Tracking Dialog */}
      <Dialog open={trackingDialogOpen} onClose={() => setTrackingDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Order Tracking - #{selectedOrder?.orderNumber}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                Track your order status and estimated delivery time
              </Alert>
              
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Current Status
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Chip label={selectedOrder.status} color={getStatusColor(selectedOrder.status)} />
                    <Chip label={selectedOrder.paymentStatus} color={getStatusColor(selectedOrder.paymentStatus)} variant="outlined" />
                    <Chip label={selectedOrder.shippingStatus} color={getStatusColor(selectedOrder.shippingStatus)} />
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Order Items
                  </Typography>
                  <Stack spacing={1}>
                    {selectedOrder.items.map((item) => (
                      <Stack key={item.id} direction="row" spacing={2} alignItems="center">
                        <Image
                          src={item.product.images[0] || '/assets/placeholder.svg'}
                          alt={item.product.name}
                          sx={{ width: 50, height: 50, borderRadius: 1 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2">
                            {item.product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Qty: {item.quantity} × {fCurrency(item.price)}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTrackingDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Support Dialog */}
      <Dialog open={supportDialogOpen} onClose={() => setSupportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Contact Customer Support</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="How can we help you?"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={supportMessage}
            onChange={(e) => setSupportMessage(e.target.value)}
            placeholder="Describe your issue or question..."
          />
          <Alert severity="info" sx={{ mt: 2 }}>
            Our support team typically responds within 24 hours.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSupportDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitSupport} variant="contained" disabled={!supportMessage.trim()}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

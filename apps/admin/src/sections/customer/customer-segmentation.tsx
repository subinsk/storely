'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Card,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Stack,
  Tooltip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  LinearProgress
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify  from '@/components/iconify';
import { useSnackbar } from '@/components/snackbar';
import { ConfirmDialog } from '@/components/custom-dialog';

// ----------------------------------------------------------------------

interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string;
  registrationDate: string;
  segments: string[];
}

interface Segment {
  id: string;
  name: string;
  description: string;
  color: string;
  rules: SegmentRule[];
  customerCount: number;
  isActive: boolean;
  createdAt: string;
}

interface SegmentRule {
  field: string;
  operator: string;
  value: string | number;
  condition: 'and' | 'or';
}

const mockSegments: Segment[] = [
  {
    id: '1',
    name: 'VIP Customers',
    description: 'High-value customers with total spent > $1000',
    color: '#FFD700',
    rules: [
      { field: 'totalSpent', operator: '>', value: 1000, condition: 'and' },
      { field: 'totalOrders', operator: '>', value: 5, condition: 'and' }
    ],
    customerCount: 45,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'New Customers',
    description: 'Customers registered in the last 30 days',
    color: '#4CAF50',
    rules: [
      { field: 'registrationDate', operator: 'last_days', value: 30, condition: 'and' }
    ],
    customerCount: 123,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'At Risk Customers',
    description: 'Customers who haven\'t ordered in 90+ days',
    color: '#FF5722',
    rules: [
      { field: 'lastOrderDate', operator: 'older_than_days', value: 90, condition: 'and' },
      { field: 'totalOrders', operator: '>', value: 1, condition: 'and' }
    ],
    customerCount: 67,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Frequent Buyers',
    description: 'Customers with 10+ orders',
    color: '#2196F3',
    rules: [
      { field: 'totalOrders', operator: '>=', value: 10, condition: 'and' }
    ],
    customerCount: 89,
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    totalOrders: 15,
    totalSpent: 2450.50,
    averageOrderValue: 163.37,
    lastOrderDate: '2024-06-28',
    registrationDate: '2023-01-15',
    segments: ['1', '4']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    totalOrders: 3,
    totalSpent: 450.25,
    averageOrderValue: 150.08,
    lastOrderDate: '2024-06-25',
    registrationDate: '2024-06-01',
    segments: ['2']
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.wilson@example.com',
    totalOrders: 8,
    totalSpent: 1850.75,
    averageOrderValue: 231.34,
    lastOrderDate: '2024-03-15',
    registrationDate: '2023-08-10',
    segments: ['1', '3']
  }
];

const segmentFields = [
  { value: 'totalSpent', label: 'Total Spent', type: 'number' },
  { value: 'totalOrders', label: 'Total Orders', type: 'number' },
  { value: 'averageOrderValue', label: 'Average Order Value', type: 'number' },
  { value: 'lastOrderDate', label: 'Last Order Date', type: 'date' },
  { value: 'registrationDate', label: 'Registration Date', type: 'date' }
];

const operators = [
  { value: '>', label: 'Greater than', types: ['number'] },
  { value: '>=', label: 'Greater than or equal', types: ['number'] },
  { value: '<', label: 'Less than', types: ['number'] },
  { value: '<=', label: 'Less than or equal', types: ['number'] },
  { value: '=', label: 'Equal to', types: ['number', 'text'] },
  { value: 'last_days', label: 'In the last X days', types: ['date'] },
  { value: 'older_than_days', label: 'Older than X days', types: ['date'] }
];

// ----------------------------------------------------------------------

export default function CustomerSegmentation() {
  const { enqueueSnackbar } = useSnackbar();
  
  const [activeTab, setActiveTab] = useState(0);
  const [segments, setSegments] = useState<Segment[]>(mockSegments);
  const [customers] = useState<Customer[]>(mockCustomers);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    content: string;
    action: () => void;
  }>({
    open: false,
    title: '',
    content: '',
    action: () => {}
  });

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    color: string;
    rules: SegmentRule[];
  }>({
    name: '',
    description: '',
    color: '#2196F3',
    rules: [
      { field: 'totalSpent', operator: '>', value: '', condition: 'and' }
    ]
  });

  const handleOpenDialog = useCallback((segment?: Segment) => {
    if (segment) {
      setEditingSegment(segment);
      setFormData({
        name: segment.name,
        description: segment.description,
        color: segment.color,
        rules: segment.rules.map(rule => ({ ...rule, value: String(rule.value) }))
      });
    } else {
      setEditingSegment(null);
      setFormData({
        name: '',
        description: '',
        color: '#2196F3',
        rules: [
          { field: 'totalSpent', operator: '>', value: '', condition: 'and' }
        ]
      });
    }
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingSegment(null);
  }, []);

  const handleAddRule = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      rules: [
        ...prev.rules,
        { field: 'totalSpent', operator: '>', value: '', condition: 'and' }
      ]
    }));
  }, []);

  const handleRemoveRule = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  }, []);

  const handleRuleChange = useCallback((index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => 
        i === index ? { ...rule, [field]: value } : rule
      )
    }));
  }, []);

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      if (editingSegment) {
        setSegments(prev => prev.map(segment => 
          segment.id === editingSegment.id 
            ? { ...segment, ...formData, customerCount: Math.floor(Math.random() * 100) }
            : segment
        ));
        enqueueSnackbar('Segment updated successfully', { variant: 'success' });
      } else {
        const newSegment: Segment = {
          id: Date.now().toString(),
          ...formData,
          customerCount: Math.floor(Math.random() * 100),
          isActive: true,
          createdAt: new Date().toISOString()
        };
        setSegments(prev => [...prev, newSegment]);
        enqueueSnackbar('Segment created successfully', { variant: 'success' });
      }
      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar('Failed to save segment', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [editingSegment, formData, enqueueSnackbar, handleCloseDialog]);

  const handleToggleActive = useCallback((id: string) => {
    setSegments(prev => prev.map(segment => 
      segment.id === id 
        ? { ...segment, isActive: !segment.isActive }
        : segment
    ));
    enqueueSnackbar('Segment status updated', { variant: 'success' });
  }, [enqueueSnackbar]);

  const handleDelete = useCallback((id: string) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Segment',
      content: 'Are you sure you want to delete this segment? This action cannot be undone.',
      action: () => {
        setSegments(prev => prev.filter(segment => segment.id !== id));
        enqueueSnackbar('Segment deleted successfully', { variant: 'success' });
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  }, [confirmDialog, enqueueSnackbar]);

  const getSegmentCustomers = useCallback((segmentId: string) => {
    return customers.filter(customer => customer.segments.includes(segmentId));
  }, [customers]);

  const renderSegmentsTab = () => (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h6">Customer Segments</Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => handleOpenDialog()}
        >
          Create Segment
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Customer segments are automatically updated based on your defined rules. 
              Use segments for targeted marketing campaigns and personalized experiences.
            </Typography>
          </Alert>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Segment</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="center">Customers</TableCell>
                    <TableCell>Rules</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {segments.map((segment) => (
                    <TableRow key={segment.id}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar
                            sx={{ 
                              bgcolor: segment.color,
                              width: 32,
                              height: 32
                            }}
                          >
                            <Iconify icon="eva:people-fill" width={16} />
                          </Avatar>
                          <Typography variant="subtitle2">
                            {segment.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {segment.description}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="h6">
                          {segment.customerCount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {segment.rules.length} rule{segment.rules.length !== 1 ? 's' : ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={segment.isActive ? 'Active' : 'Inactive'}
                          color={segment.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="View Customers">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedSegment(segment.id);
                                setActiveTab(1);
                              }}
                            >
                              <Iconify icon="eva:people-fill" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(segment)}
                            >
                              <Iconify icon="eva:edit-fill" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title={segment.isActive ? 'Deactivate' : 'Activate'}>
                            <IconButton
                              size="small"
                              onClick={() => handleToggleActive(segment.id)}
                            >
                              <Iconify icon={segment.isActive ? 'eva:eye-off-fill' : 'eva:eye-fill'} />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(segment.id)}
                            >
                              <Iconify icon="eva:trash-2-fill" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderCustomersTab = () => {
    const filteredCustomers = selectedSegment 
      ? getSegmentCustomers(selectedSegment)
      : customers;

    const selectedSegmentData = selectedSegment 
      ? segments.find(s => s.id === selectedSegment)
      : null;

    return (
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Box>
            <Typography variant="h6">
              {selectedSegmentData ? `${selectedSegmentData.name} Customers` : 'All Customers'}
            </Typography>
            {selectedSegmentData && (
              <Typography variant="body2" color="text.secondary">
                {selectedSegmentData.description}
              </Typography>
            )}
          </Box>
          {selectedSegment && (
            <Button
              variant="outlined"
              onClick={() => setSelectedSegment(null)}
            >
              View All Customers
            </Button>
          )}
        </Stack>

        <Card>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell align="right">Total Orders</TableCell>
                  <TableCell align="right">Total Spent</TableCell>
                  <TableCell align="right">Avg Order Value</TableCell>
                  <TableCell>Last Order</TableCell>
                  <TableCell>Segments</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar>{customer.name.charAt(0)}</Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {customer.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {customer.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {customer.totalOrders}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        ${customer.totalSpent.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        ${customer.averageOrderValue.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(customer.lastOrderDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        {customer.segments.map((segmentId) => {
                          const segment = segments.find(s => s.id === segmentId);
                          return segment ? (
                            <Chip
                              key={segmentId}
                              label={segment.name}
                              size="small"
                              sx={{ bgcolor: segment.color + '20', color: segment.color }}
                            />
                          ) : null;
                        })}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
    );
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Customer Segmentation</Typography>
      </Stack>

      <Card sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Segments" />
          <Tab label="Customers" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && renderSegmentsTab()}
          {activeTab === 1 && renderCustomersTab()}
        </Box>
      </Card>

      {/* Create/Edit Segment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSegment ? 'Edit Segment' : 'Create New Segment'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Segment Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </Grid>
            </Grid>
            
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            
            <Divider />
            
            <Typography variant="h6">Segment Rules</Typography>
            
            {formData.rules.map((rule, index) => (
              <Card key={index} sx={{ p: 2, bgcolor: 'background.neutral' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Field</InputLabel>
                      <Select
                        value={rule.field}
                        label="Field"
                        onChange={(e) => handleRuleChange(index, 'field', e.target.value)}
                      >
                        {segmentFields.map((field) => (
                          <MenuItem key={field.value} value={field.value}>
                            {field.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Operator</InputLabel>
                      <Select
                        value={rule.operator}
                        label="Operator"
                        onChange={(e) => handleRuleChange(index, 'operator', e.target.value)}
                      >
                        {operators
                          .filter(op => {
                            const field = segmentFields.find(f => f.value === rule.field);
                            return field ? op.types.includes(field.type) : true;
                          })
                          .map((operator) => (
                            <MenuItem key={operator.value} value={operator.value}>
                              {operator.label}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Value"
                      type={segmentFields.find(f => f.value === rule.field)?.type === 'number' ? 'number' : 'text'}
                      value={rule.value}
                      onChange={(e) => handleRuleChange(index, 'value', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Condition</InputLabel>
                      <Select
                        value={rule.condition}
                        label="Condition"
                        onChange={(e) => handleRuleChange(index, 'condition', e.target.value)}
                        disabled={index === 0}
                      >
                        <MenuItem value="and">AND</MenuItem>
                        <MenuItem value="or">OR</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={1}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveRule(index)}
                      disabled={formData.rules.length === 1}
                    >
                      <Iconify icon="eva:trash-2-fill" />
                    </IconButton>
                  </Grid>
                </Grid>
              </Card>
            ))}
            
            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleAddRule}
            >
              Add Rule
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <LoadingButton
            variant="contained"
            onClick={handleSave}
            loading={loading}
          >
            {editingSegment ? 'Update' : 'Create'} Segment
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        title={confirmDialog.title}
        content={confirmDialog.content}
        action={confirmDialog.action}
      />
    </Box>
  );
}

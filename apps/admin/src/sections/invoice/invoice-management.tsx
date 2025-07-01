import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm, Controller } from 'react-hook-form';
import { 
  useGetInvoices, 
  createInvoice, 
  updateInvoice, 
  sendInvoice, 
  downloadInvoicePDF,
  Invoice,
  InvoiceFormData 
} from '@/services/invoice.service';
import { fCurrency } from '@/utils/format-number';
import { fDateTime } from '@/utils/format-time';
import Iconify from '@/components/iconify';

const getStatusColor = (status: string) => {
  const colors = {
    draft: 'default',
    sent: 'info',
    paid: 'success',
    overdue: 'error',
    cancelled: 'warning'
  };
  return colors[status as keyof typeof colors] || 'default';
};

interface InvoiceManagementProps {
  orderId?: string;
}

export default function InvoiceManagement({ orderId }: InvoiceManagementProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);

  const { invoices, pagination, isLoading, mutate } = useGetInvoices({
    page,
    limit: 10,
    search,
    status: statusFilter
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<InvoiceFormData>({
    defaultValues: {
      orderId: orderId || '',
      status: 'draft',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [{ description: '', quantity: 1, unitPrice: 0 }]
    }
  });

  const handleCreateInvoice = async (data: InvoiceFormData) => {
    try {
      setLoading(true);
      await createInvoice(data);
      setCreateDialogOpen(false);
      reset();
      mutate();
    } catch (error) {
      console.error('Failed to create invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvoice = async (invoice: Invoice) => {
    try {
      setLoading(true);
      await sendInvoice(invoice.id, invoice.order.user.email);
      await updateInvoice(invoice.id, { status: 'sent' });
      mutate();
    } catch (error) {
      console.error('Failed to send invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      const blob = await downloadInvoicePDF(invoice.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
  };

  const handleUpdateStatus = async (invoice: Invoice, status: string) => {
    try {
      await updateInvoice(invoice.id, { status: status as any });
      mutate();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <Box>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h5">Invoice Management</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Invoice
          </Button>
        </Stack>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search invoices..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: <Iconify icon="mingcute:search-line" sx={{ mr: 1 }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="sent">Sent</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="overdue">Overdue</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice Number</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Issue Date</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {invoice.invoiceNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Order: {invoice.order.orderNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {invoice.order.user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {invoice.order.user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(invoice.issueDate).toLocaleDateString('en-US', { 
                        year: 'numeric', month: 'short', day: '2-digit' 
                      })}
                    </TableCell>
                    <TableCell>
                      {new Date(invoice.dueDate).toLocaleDateString('en-US', { 
                        year: 'numeric', month: 'short', day: '2-digit' 
                      })}
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {fCurrency(invoice.totalAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={invoice.status}
                        color={getStatusColor(invoice.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {invoice.status === 'draft' && (
                          <IconButton
                            size="small"
                            onClick={() => handleSendInvoice(invoice)}
                            title="Send Invoice"
                          >
                            <Iconify icon="mingcute:send-line" />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => handleDownloadPDF(invoice)}
                          title="Download PDF"
                        >
                          <Iconify icon="mingcute:download-line" />
                        </IconButton>
                        {invoice.status !== 'paid' && (
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateStatus(invoice, 'paid')}
                            title="Mark as Paid"
                            color="success"
                          >
                            <Iconify icon="mingcute:check-line" />
                          </IconButton>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Create Invoice Dialog */}
        <Dialog 
          open={createDialogOpen} 
          onClose={() => setCreateDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <form onSubmit={handleSubmit(handleCreateInvoice)}>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="orderId"
                    control={control}
                    rules={{ required: 'Order ID is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Order ID"
                        error={!!errors.orderId}
                        helperText={errors.orderId?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select {...field} label="Status">
                          <MenuItem value="draft">Draft</MenuItem>
                          <MenuItem value="sent">Sent</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="issueDate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Issue Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="dueDate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Due Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={loading}
              >
                Create Invoice
              </LoadingButton>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
  );
}

'use client';

import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Stack,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  FormControlLabel,
  Paper,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Iconify } from '@storely/shared/components/iconify';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

interface DataRequest {
  id: string;
  type: 'access' | 'deletion' | 'portability' | 'rectification';
  customerEmail: string;
  customerName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  requestDate: string;
  completionDate?: string;
  reason?: string;
  dataTypes: string[];
}

interface ComplianceMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  status: 'compliant' | 'warning' | 'non_compliant';
}

interface ConsentRecord {
  id: string;
  customerEmail: string;
  customerName: string;
  consentType: string;
  status: 'given' | 'withdrawn';
  timestamp: string;
  purpose: string;
  version: string;
}

// Mock data
const mockDataRequests: DataRequest[] = [
  {
    id: '1',
    type: 'access',
    customerEmail: 'customer@example.com',
    customerName: 'John Customer',
    status: 'pending',
    requestDate: new Date().toISOString(),
    dataTypes: ['personal_info', 'order_history', 'preferences']
  },
  {
    id: '2',
    type: 'deletion',
    customerEmail: 'user@example.com',
    customerName: 'Jane User',
    status: 'completed',
    requestDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    completionDate: new Date().toISOString(),
    dataTypes: ['personal_info', 'order_history']
  },
];

const mockComplianceMetrics: ComplianceMetric[] = [
  { name: 'Data Request Response Time', value: 25, target: 30, unit: 'days', status: 'compliant' },
  { name: 'Consent Rate', value: 85, target: 80, unit: '%', status: 'compliant' },
  { name: 'Data Retention Compliance', value: 92, target: 95, unit: '%', status: 'warning' },
  { name: 'Security Incident Response', value: 15, target: 24, unit: 'hours', status: 'compliant' },
];

const mockConsentRecords: ConsentRecord[] = [
  {
    id: '1',
    customerEmail: 'customer@example.com',
    customerName: 'John Customer',
    consentType: 'Marketing Communications',
    status: 'given',
    timestamp: new Date().toISOString(),
    purpose: 'Email marketing and promotional offers',
    version: '2.1'
  },
  {
    id: '2',
    customerEmail: 'user@example.com',
    customerName: 'Jane User',
    consentType: 'Analytics Tracking',
    status: 'withdrawn',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    purpose: 'Website analytics and user behavior tracking',
    version: '2.0'
  },
];

// ----------------------------------------------------------------------

export default function GDPRCompliance() {
  const { enqueueSnackbar } = useSnackbar();
  
  const [currentTab, setCurrentTab] = useState(0);
  const [dataRequests, setDataRequests] = useState<DataRequest[]>(mockDataRequests);
  const [complianceMetrics] = useState<ComplianceMetric[]>(mockComplianceMetrics);
  const [consentRecords] = useState<ConsentRecord[]>(mockConsentRecords);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DataRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Data Processing Assessment
  const [activeStep, setActiveStep] = useState(0);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, any>>({});

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleProcessRequest = useCallback(async (requestId: string, action: 'approve' | 'reject', reason?: string) => {
    setLoading(true);
    try {
      setDataRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: action === 'approve' ? 'in_progress' : 'rejected', reason }
          : req
      ));
      enqueueSnackbar(`Request ${action}d successfully`, { variant: 'success' });
      setDialogOpen(false);
    } catch (error) {
      enqueueSnackbar(`Failed to ${action} request`, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const getStatusColor = (status: DataRequest['status']) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getComplianceColor = (status: ComplianceMetric['status']) => {
    switch (status) {
      case 'compliant': return 'success';
      case 'warning': return 'warning';
      case 'non_compliant': return 'error';
      default: return 'default';
    }
  };

  const renderDataRequests = () => (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Data Subject Requests
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Request Type</TableCell>
                  <TableCell>Data Types</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Request Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {request.customerName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {request.customerEmail}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {request.dataTypes.map((type) => (
                          <Chip
                            key={type}
                            label={type.replace('_', ' ')}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={request.status.replace('_', ' ').charAt(0).toUpperCase() + request.status.slice(1)}
                        color={getStatusColor(request.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(request.requestDate), 'MMM dd, yyyy')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedRequest(request);
                              setDialogOpen(true);
                            }}
                          >
                            <Iconify icon="eva:eye-fill" />
                          </IconButton>
                        </Tooltip>
                        {request.status === 'pending' && (
                          <>
                            <Tooltip title="Approve">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleProcessRequest(request.id, 'approve')}
                              >
                                <Iconify icon="eva:checkmark-fill" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleProcessRequest(request.id, 'reject')}
                              >
                                <Iconify icon="eva:close-fill" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Stack>
  );

  const renderComplianceOverview = () => (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Compliance Metrics
          </Typography>
          
          <Grid container spacing={3}>
            {complianceMetrics.map((metric) => (
              <Grid item xs={12} sm={6} md={3} key={metric.name}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2">
                        {metric.name}
                      </Typography>
                      <Typography variant="h4">
                        {metric.value}{metric.unit}
                      </Typography>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Chip
                          label={metric.status.replace('_', ' ').charAt(0).toUpperCase() + metric.status.slice(1)}
                          color={getComplianceColor(metric.status)}
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          Target: {metric.target}{metric.unit}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Iconify icon="eva:download-fill" />}
                onClick={() => enqueueSnackbar('Compliance report generated', { variant: 'success' })}
              >
                Generate Report
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Iconify icon="eva:shield-fill" />}
                onClick={() => enqueueSnackbar('Privacy audit initiated', { variant: 'info' })}
              >
                Privacy Audit
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Iconify icon="eva:email-fill" />}
                onClick={() => enqueueSnackbar('Consent reminder sent', { variant: 'success' })}
              >
                Send Consent Reminder
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Iconify icon="eva:trash-2-fill" />}
                onClick={() => enqueueSnackbar('Data cleanup scheduled', { variant: 'success' })}
              >
                Data Cleanup
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );

  const renderConsentManagement = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Consent Records
        </Typography>
        
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Consent Type</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Version</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consentRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {record.customerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {record.customerEmail}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{record.consentType}</TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {record.purpose}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      color={record.status === 'given' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(record.timestamp), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>v{record.version}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderDataProcessingAssessment = () => {
    const assessmentSteps = [
      {
        label: 'Data Collection',
        description: 'Identify what personal data you collect',
        questions: [
          'What personal data do you collect?',
          'How do you collect this data?',
          'Do you obtain explicit consent?'
        ]
      },
      {
        label: 'Data Processing',
        description: 'Assess how you process personal data',
        questions: [
          'What is the legal basis for processing?',
          'How is the data processed?',
          'Who has access to the data?'
        ]
      },
      {
        label: 'Data Storage',
        description: 'Review data storage and security measures',
        questions: [
          'Where is the data stored?',
          'How long is data retained?',
          'What security measures are in place?'
        ]
      },
      {
        label: 'Data Sharing',
        description: 'Evaluate data sharing practices',
        questions: [
          'Do you share data with third parties?',
          'Do you have data processing agreements?',
          'Is data transferred outside the EU?'
        ]
      }
    ];

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Data Processing Impact Assessment (DPIA)
          </Typography>
          
          <Stepper activeStep={activeStep} orientation="vertical">
            {assessmentSteps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {step.description}
                  </Typography>
                  
                  <Stack spacing={2}>
                    {step.questions.map((question, qIndex) => (
                      <TextField
                        key={qIndex}
                        fullWidth
                        label={question}
                        multiline
                        rows={2}
                        variant="outlined"
                        value={assessmentAnswers[`${index}-${qIndex}`] || ''}
                        onChange={(e) => setAssessmentAnswers(prev => ({
                          ...prev,
                          [`${index}-${qIndex}`]: e.target.value
                        }))}
                      />
                    ))}
                  </Stack>
                  
                  <Box sx={{ mb: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => setActiveStep(activeStep + 1)}
                      sx={{ mr: 1 }}
                      disabled={index === assessmentSteps.length - 1}
                    >
                      {index === assessmentSteps.length - 1 ? 'Complete' : 'Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={() => setActiveStep(activeStep - 1)}
                    >
                      Back
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          
          {activeStep === assessmentSteps.length && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography>Assessment completed!</Typography>
              <Button onClick={() => setActiveStep(0)} sx={{ mt: 1, mr: 1 }}>
                Reset
              </Button>
              <Button
                variant="contained"
                onClick={() => enqueueSnackbar('DPIA report generated', { variant: 'success' })}
                sx={{ mt: 1 }}
              >
                Generate Report
              </Button>
            </Paper>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Stack spacing={3}>
        <Typography variant="h4">GDPR Compliance</Typography>
        
        <Alert severity="info">
          Manage GDPR compliance with tools for data subject requests, consent management, and privacy impact assessments.
        </Alert>

        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="Data Requests" />
          <Tab label="Consent Management" />
          <Tab label="DPIA" />
        </Tabs>

        {currentTab === 0 && renderComplianceOverview()}
        {currentTab === 1 && renderDataRequests()}
        {currentTab === 2 && renderConsentManagement()}
        {currentTab === 3 && renderDataProcessingAssessment()}
      </Stack>

      {/* Request Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Data Request Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Customer:</Typography>
                  <Typography variant="body2">
                    {selectedRequest.customerName} ({selectedRequest.customerEmail})
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Request Type:</Typography>
                  <Typography variant="body2">
                    {selectedRequest.type.charAt(0).toUpperCase() + selectedRequest.type.slice(1)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Status:</Typography>
                  <Chip
                    label={selectedRequest.status.replace('_', ' ').charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                    color={getStatusColor(selectedRequest.status)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Request Date:</Typography>
                  <Typography variant="body2">
                    {format(new Date(selectedRequest.requestDate), 'MMM dd, yyyy HH:mm')}
                  </Typography>
                </Grid>
              </Grid>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>Data Types Requested:</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {selectedRequest.dataTypes.map((type) => (
                    <Chip
                      key={type}
                      label={type.replace('_', ' ')}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Stack>
              </Box>
              
              {selectedRequest.reason && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Reason:</Typography>
                  <Typography variant="body2">{selectedRequest.reason}</Typography>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          {selectedRequest?.status === 'pending' && (
            <>
              <LoadingButton
                loading={loading}
                color="error"
                onClick={() => handleProcessRequest(selectedRequest.id, 'reject', 'Insufficient information provided')}
              >
                Reject
              </LoadingButton>
              <LoadingButton
                loading={loading}
                variant="contained"
                onClick={() => handleProcessRequest(selectedRequest.id, 'approve')}
              >
                Approve
              </LoadingButton>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

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
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
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

interface BackupRecord {
  id: string;
  name: string;
  type: 'full' | 'database' | 'files' | 'configuration';
  size: string;
  createdAt: string;
  status: 'completed' | 'in_progress' | 'failed';
  downloadUrl?: string;
  description: string;
  duration: string;
}

interface BackupSchedule {
  id: string;
  name: string;
  type: 'full' | 'database' | 'files';
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  isEnabled: boolean;
  lastRun?: string;
  nextRun: string;
  retention: number; // days
}

interface RestoreJob {
  id: string;
  backupId: string;
  backupName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

// Mock data
const mockBackups: BackupRecord[] = [
  {
    id: '1',
    name: 'Full System Backup - 2024-01-15',
    type: 'full',
    size: '2.4 GB',
    createdAt: new Date().toISOString(),
    status: 'completed',
    downloadUrl: '#',
    description: 'Complete system backup including database, files, and configuration',
    duration: '45 minutes'
  },
  {
    id: '2',
    name: 'Database Backup - 2024-01-15',
    type: 'database',
    size: '120 MB',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    downloadUrl: '#',
    description: 'Database backup including all product and order data',
    duration: '5 minutes'
  },
  {
    id: '3',
    name: 'Configuration Backup - 2024-01-14',
    type: 'configuration',
    size: '2.1 MB',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    downloadUrl: '#',
    description: 'System configuration and settings backup',
    duration: '30 seconds'
  },
];

const mockSchedules: BackupSchedule[] = [
  {
    id: '1',
    name: 'Daily Database Backup',
    type: 'database',
    frequency: 'daily',
    time: '02:00',
    isEnabled: true,
    lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    nextRun: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    retention: 7
  },
  {
    id: '2',
    name: 'Weekly Full Backup',
    type: 'full',
    frequency: 'weekly',
    time: '01:00',
    isEnabled: true,
    lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    nextRun: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    retention: 30
  },
];

const mockRestoreJobs: RestoreJob[] = [
  {
    id: '1',
    backupId: '1',
    backupName: 'Full System Backup - 2024-01-15',
    status: 'in_progress',
    progress: 65,
    startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
];

// ----------------------------------------------------------------------

export default function BackupRestore() {
  const { enqueueSnackbar } = useSnackbar();
  
  const [currentTab, setCurrentTab] = useState(0);
  const [backups] = useState<BackupRecord[]>(mockBackups);
  const [schedules, setSchedules] = useState<BackupSchedule[]>(mockSchedules);
  const [restoreJobs] = useState<RestoreJob[]>(mockRestoreJobs);
  const [loading, setLoading] = useState(false);
  
  // Create backup dialog
  const [createBackupOpen, setCreateBackupOpen] = useState(false);
  const [backupType, setBackupType] = useState<'full' | 'database' | 'files' | 'configuration'>('database');
  const [backupName, setBackupName] = useState('');
  const [includeFiles, setIncludeFiles] = useState(true);
  const [includeDatabase, setIncludeDatabase] = useState(true);
  const [includeConfig, setIncludeConfig] = useState(true);
  
  // Restore dialog
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupRecord | null>(null);
  const [restoreActiveStep, setRestoreActiveStep] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleCreateBackup = useCallback(async () => {
    if (!backupName.trim()) {
      enqueueSnackbar('Please enter a backup name', { variant: 'error' });
      return;
    }

    setLoading(true);
    try {
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      enqueueSnackbar('Backup started successfully', { variant: 'success' });
      setCreateBackupOpen(false);
      setBackupName('');
    } catch (error) {
      enqueueSnackbar('Failed to create backup', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [backupName, enqueueSnackbar]);

  const handleToggleSchedule = useCallback(async (scheduleId: string, enabled: boolean) => {
    setLoading(true);
    try {
      setSchedules(prev => prev.map(s => 
        s.id === scheduleId ? { ...s, isEnabled: enabled } : s
      ));
      enqueueSnackbar(`Schedule ${enabled ? 'enabled' : 'disabled'}`, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to update schedule', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const handleStartRestore = useCallback(async () => {
    if (!selectedBackup) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      enqueueSnackbar('Restore started successfully', { variant: 'success' });
      setRestoreDialogOpen(false);
      setRestoreActiveStep(0);
    } catch (error) {
      enqueueSnackbar('Failed to start restore', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [selectedBackup, enqueueSnackbar]);

  const getStatusColor = (status: BackupRecord['status'] | RestoreJob['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'failed': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: BackupRecord['type']) => {
    switch (type) {
      case 'full': return 'eva:hard-drive-fill';
      case 'database': return 'eva:database-fill';
      case 'files': return 'eva:folder-fill';
      case 'configuration': return 'eva:settings-fill';
      default: return 'eva:archive-fill';
    }
  };

  const renderBackupList = () => (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">Backup History</Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => setCreateBackupOpen(true)}
            >
              Create Backup
            </Button>
          </Stack>
          
          <List>
            {backups.map((backup, index) => (
              <React.Fragment key={backup.id}>
                <ListItem>
                  <ListItemIcon>
                    <Iconify icon={getTypeIcon(backup.type)} width={24} />
                  </ListItemIcon>
                  <ListItemText
                    primary={backup.name}
                    secondary={
                      <Stack spacing={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          {backup.description}
                        </Typography>
                        <Stack direction="row" spacing={2}>
                          <Typography variant="caption">
                            Size: {backup.size}
                          </Typography>
                          <Typography variant="caption">
                            Duration: {backup.duration}
                          </Typography>
                          <Typography variant="caption">
                            {format(new Date(backup.createdAt), 'MMM dd, yyyy HH:mm')}
                          </Typography>
                        </Stack>
                      </Stack>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={backup.status.charAt(0).toUpperCase() + backup.status.slice(1)}
                        color={getStatusColor(backup.status)}
                        size="small"
                      />
                      {backup.status === 'completed' && (
                        <>
                          <Tooltip title="Download">
                            <IconButton size="small">
                              <Iconify icon="eva:download-fill" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Restore">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedBackup(backup);
                                setRestoreDialogOpen(true);
                              }}
                            >
                              <Iconify icon="eva:refresh-fill" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error">
                          <Iconify icon="eva:trash-2-fill" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < backups.length - 1 && <Box sx={{ borderBottom: 1, borderColor: 'divider', mx: 2 }} />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Stack>
  );

  const renderSchedules = () => (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">Backup Schedules</Typography>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => enqueueSnackbar('Schedule creation dialog would open', { variant: 'info' })}
            >
              Add Schedule
            </Button>
          </Stack>
          
          <List>
            {schedules.map((schedule, index) => (
              <React.Fragment key={schedule.id}>
                <ListItem>
                  <ListItemIcon>
                    <Iconify icon={getTypeIcon(schedule.type)} width={24} />
                  </ListItemIcon>
                  <ListItemText
                    primary={schedule.name}
                    secondary={
                      <Stack spacing={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          {schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)} at {schedule.time}
                        </Typography>
                        <Stack direction="row" spacing={2}>
                          <Typography variant="caption">
                            Retention: {schedule.retention} days
                          </Typography>
                          {schedule.lastRun && (
                            <Typography variant="caption">
                              Last run: {format(new Date(schedule.lastRun), 'MMM dd, HH:mm')}
                            </Typography>
                          )}
                          <Typography variant="caption">
                            Next run: {format(new Date(schedule.nextRun), 'MMM dd, HH:mm')}
                          </Typography>
                        </Stack>
                      </Stack>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={schedule.isEnabled ? 'Enabled' : 'Disabled'}
                        color={schedule.isEnabled ? 'success' : 'default'}
                        size="small"
                      />
                      <Tooltip title="Edit">
                        <IconButton size="small">
                          <Iconify icon="eva:edit-fill" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Run Now">
                        <IconButton size="small">
                          <Iconify icon="eva:play-circle-fill" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={schedule.isEnabled ? 'Disable' : 'Enable'}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleSchedule(schedule.id, !schedule.isEnabled)}
                        >
                          <Iconify icon={schedule.isEnabled ? 'eva:pause-circle-fill' : 'eva:play-circle-fill'} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < schedules.length - 1 && <Box sx={{ borderBottom: 1, borderColor: 'divider', mx: 2 }} />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Stack>
  );

  const renderRestoreJobs = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Active Restore Jobs
        </Typography>
        
        {restoreJobs.length === 0 ? (
          <Alert severity="info">No active restore jobs</Alert>
        ) : (
          <List>
            {restoreJobs.map((job) => (
              <ListItem key={job.id}>
                <ListItemIcon>
                  <Iconify icon="eva:refresh-fill" width={24} />
                </ListItemIcon>
                <ListItemText
                  primary={job.backupName}
                  secondary={
                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        Started: {format(new Date(job.startedAt), 'MMM dd, yyyy HH:mm')}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={job.progress}
                        sx={{ width: '100%' }}
                      />
                      <Typography variant="caption">
                        {job.progress}% complete
                      </Typography>
                    </Stack>
                  }
                />
                <ListItemSecondaryAction>
                  <Chip
                    label={job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    color={getStatusColor(job.status)}
                    size="small"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );

  const restoreSteps = [
    {
      label: 'Select Backup',
      description: 'Choose the backup you want to restore'
    },
    {
      label: 'Confirm Settings',
      description: 'Review restore options and confirm'
    },
    {
      label: 'Start Restore',
      description: 'Begin the restore process'
    }
  ];

  return (
    <Box>
      <Stack spacing={3}>
        <Typography variant="h4">Backup & Restore</Typography>
        
        <Alert severity="warning">
          Regular backups are essential for data protection. Ensure you have recent backups before making major system changes.
        </Alert>

        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Backups" />
          <Tab label="Schedules" />
          <Tab label="Restore Jobs" />
        </Tabs>

        {currentTab === 0 && renderBackupList()}
        {currentTab === 1 && renderSchedules()}
        {currentTab === 2 && renderRestoreJobs()}
      </Stack>

      {/* Create Backup Dialog */}
      <Dialog
        open={createBackupOpen}
        onClose={() => setCreateBackupOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Backup</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Backup Name"
              value={backupName}
              onChange={(e) => setBackupName(e.target.value)}
              placeholder="e.g., Pre-update backup"
            />
            
            <FormControl fullWidth>
              <InputLabel>Backup Type</InputLabel>
              <Select
                value={backupType}
                label="Backup Type"
                onChange={(e) => setBackupType(e.target.value as any)}
              >
                <MenuItem value="full">Full System Backup</MenuItem>
                <MenuItem value="database">Database Only</MenuItem>
                <MenuItem value="files">Files Only</MenuItem>
                <MenuItem value="configuration">Configuration Only</MenuItem>
              </Select>
            </FormControl>
            
            {backupType === 'full' && (
              <Stack spacing={1}>
                <Typography variant="subtitle2">Include:</Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeDatabase}
                      onChange={(e) => setIncludeDatabase(e.target.checked)}
                    />
                  }
                  label="Database"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeFiles}
                      onChange={(e) => setIncludeFiles(e.target.checked)}
                    />
                  }
                  label="Files"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeConfig}
                      onChange={(e) => setIncludeConfig(e.target.checked)}
                    />
                  }
                  label="Configuration"
                />
              </Stack>
            )}
            
            <Alert severity="info">
              Backup creation may take several minutes depending on the amount of data.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateBackupOpen(false)}>Cancel</Button>
          <LoadingButton
            loading={loading}
            variant="contained"
            onClick={handleCreateBackup}
          >
            Create Backup
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Restore Dialog */}
      <Dialog
        open={restoreDialogOpen}
        onClose={() => setRestoreDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Restore System</DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <Alert severity="warning">
              Restoring will overwrite current data. Make sure you have a recent backup before proceeding.
            </Alert>
            
            <Stepper activeStep={restoreActiveStep} orientation="vertical">
              {restoreSteps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
                    
                    {index === 0 && selectedBackup && (
                      <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                        <Typography variant="subtitle2">{selectedBackup.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedBackup.description}
                        </Typography>
                        <Typography variant="caption">
                          Size: {selectedBackup.size} | Created: {format(new Date(selectedBackup.createdAt), 'MMM dd, yyyy HH:mm')}
                        </Typography>
                      </Paper>
                    )}
                    
                    {index === 1 && (
                      <Stack spacing={2} sx={{ mt: 2 }}>
                        <FormControlLabel
                          control={<Checkbox defaultChecked />}
                          label="Stop all services during restore"
                        />
                        <FormControlLabel
                          control={<Checkbox />}
                          label="Send notification when complete"
                        />
                      </Stack>
                    )}
                    
                    <Box sx={{ mb: 2, mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => {
                          if (index === restoreSteps.length - 1) {
                            handleStartRestore();
                          } else {
                            setRestoreActiveStep(index + 1);
                          }
                        }}
                        sx={{ mr: 1 }}
                      >
                        {index === restoreSteps.length - 1 ? 'Start Restore' : 'Continue'}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={() => setRestoreActiveStep(index - 1)}
                      >
                        Back
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestoreDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

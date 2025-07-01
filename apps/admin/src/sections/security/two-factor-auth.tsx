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
  Switch,
  FormControlLabel,
  Paper,
  Divider,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Tabs,
  Tab,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '@/components/iconify';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

interface TwoFactorMethod {
  id: string;
  type: 'authenticator' | 'sms' | 'email' | 'backup_codes';
  name: string;
  isEnabled: boolean;
  isSetup: boolean;
  lastUsed?: string;
  icon: string;
  description: string;
}

interface UserTwoFactorStatus {
  userId: string;
  userName: string;
  userEmail: string;
  isEnabled: boolean;
  methods: string[];
  lastLogin?: string;
  backupCodesUsed: number;
  totalBackupCodes: number;
}

interface TwoFactorLog {
  id: string;
  userId: string;
  userName: string;
  action: 'setup' | 'login' | 'disable' | 'recovery';
  method: string;
  status: 'success' | 'failed';
  timestamp: string;
  ipAddress: string;
}

// Mock data
const mockTwoFactorMethods: TwoFactorMethod[] = [
  {
    id: '1',
    type: 'authenticator',
    name: 'Authenticator App',
    isEnabled: true,
    isSetup: true,
    lastUsed: new Date().toISOString(),
    icon: 'eva:smartphone-fill',
    description: 'Use Google Authenticator or similar apps'
  },
  {
    id: '2',
    type: 'sms',
    name: 'SMS',
    isEnabled: false,
    isSetup: false,
    icon: 'eva:message-square-fill',
    description: 'Receive codes via text message'
  },
  {
    id: '3',
    type: 'email',
    name: 'Email',
    isEnabled: true,
    isSetup: true,
    lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    icon: 'eva:email-fill',
    description: 'Receive codes via email'
  },
  {
    id: '4',
    type: 'backup_codes',
    name: 'Backup Codes',
    isEnabled: true,
    isSetup: true,
    icon: 'eva:shield-fill',
    description: 'One-time use backup codes'
  },
];

const mockUserStatuses: UserTwoFactorStatus[] = [
  {
    userId: '1',
    userName: 'John Admin',
    userEmail: 'admin@furnerio.com',
    isEnabled: true,
    methods: ['authenticator', 'email'],
    lastLogin: new Date().toISOString(),
    backupCodesUsed: 2,
    totalBackupCodes: 10
  },
  {
    userId: '2',
    userName: 'Jane Manager',
    userEmail: 'manager@furnerio.com',
    isEnabled: false,
    methods: [],
    lastLogin: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    backupCodesUsed: 0,
    totalBackupCodes: 0
  },
];

const mockTwoFactorLogs: TwoFactorLog[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Admin',
    action: 'login',
    method: 'authenticator',
    status: 'success',
    timestamp: new Date().toISOString(),
    ipAddress: '192.168.1.100'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Jane Manager',
    action: 'login',
    method: 'email',
    status: 'failed',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.101'
  },
];

// ----------------------------------------------------------------------

export default function TwoFactorAuthentication() {
  const { enqueueSnackbar } = useSnackbar();
  
  const [currentTab, setCurrentTab] = useState(0);
  const [methods, setMethods] = useState<TwoFactorMethod[]>(mockTwoFactorMethods);
  const [userStatuses] = useState<UserTwoFactorStatus[]>(mockUserStatuses);
  const [logs] = useState<TwoFactorLog[]>(mockTwoFactorLogs);
  const [loading, setLoading] = useState(false);
  const [setupDialogOpen, setSetupDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<TwoFactorMethod | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  // Mock QR code secret for demo
  const qrSecret = 'JBSWY3DPEHPK3PXP';
  const qrCodeUrl = `otpauth://totp/Furnerio%20Admin:admin@furnerio.com?secret=${qrSecret}&issuer=Furnerio`;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleToggleMethod = useCallback(async (methodId: string, enabled: boolean) => {
    setLoading(true);
    try {
      const method = methods.find(m => m.id === methodId);
      if (!method) return;

      if (enabled && !method.isSetup) {
        setSelectedMethod(method);
        setSetupDialogOpen(true);
      } else {
        setMethods(prev => prev.map(m => 
          m.id === methodId ? { ...m, isEnabled: enabled } : m
        ));
        enqueueSnackbar(`${method.name} ${enabled ? 'enabled' : 'disabled'}`, { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar('Failed to update 2FA method', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [methods, enqueueSnackbar]);

  const handleSetupMethod = useCallback(async () => {
    if (!selectedMethod) return;

    setLoading(true);
    try {
      // Verify the code for authenticator setup
      if (selectedMethod.type === 'authenticator' && !verificationCode) {
        enqueueSnackbar('Please enter the verification code', { variant: 'error' });
        return;
      }

      // Generate backup codes if setting up backup codes
      if (selectedMethod.type === 'backup_codes') {
        const codes = Array.from({ length: 10 }, () => 
          Math.random().toString(36).substring(2, 8).toUpperCase()
        );
        setBackupCodes(codes);
        setShowBackupCodes(true);
      }

      setMethods(prev => prev.map(m => 
        m.id === selectedMethod.id 
          ? { ...m, isEnabled: true, isSetup: true, lastUsed: new Date().toISOString() }
          : m
      ));

      enqueueSnackbar(`${selectedMethod.name} setup successfully`, { variant: 'success' });
      setSetupDialogOpen(false);
      setVerificationCode('');
    } catch (error) {
      enqueueSnackbar('Failed to setup 2FA method', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [selectedMethod, verificationCode, enqueueSnackbar]);

  const handleGenerateBackupCodes = useCallback(async () => {
    setLoading(true);
    try {
      const codes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 8).toUpperCase()
      );
      setBackupCodes(codes);
      setShowBackupCodes(true);
      enqueueSnackbar('New backup codes generated', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to generate backup codes', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const getMethodIcon = (type: TwoFactorMethod['type']) => {
    const method = methods.find(m => m.type === type);
    return method?.icon || 'eva:shield-fill';
  };

  const getStatusColor = (status: string) => {
    return status === 'success' ? 'success' : 'error';
  };

  const renderMethodsConfiguration = () => (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Two-Factor Authentication Methods
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            Enable multiple 2FA methods to secure your account. At least one method must be enabled.
          </Alert>
          
          <List>
            {methods.map((method, index) => (
              <React.Fragment key={method.id}>
                <ListItem>
                  <ListItemIcon>
                    <Iconify icon={method.icon} width={24} />
                  </ListItemIcon>
                  <ListItemText
                    primary={method.name}
                    secondary={
                      <Stack spacing={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          {method.description}
                        </Typography>
                        {method.lastUsed && (
                          <Typography variant="caption" color="text.secondary">
                            Last used: {format(new Date(method.lastUsed), 'MMM dd, yyyy HH:mm')}
                          </Typography>
                        )}
                      </Stack>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {method.isSetup && (
                        <Chip
                          label="Setup"
                          color="success"
                          size="small"
                          variant="outlined"
                        />
                      )}
                      <Switch
                        checked={method.isEnabled}
                        onChange={(e) => handleToggleMethod(method.id, e.target.checked)}
                        disabled={loading}
                      />
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < methods.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Backup Options
          </Typography>
          
          <Stack spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:shield-fill" />}
              onClick={handleGenerateBackupCodes}
              disabled={loading}
            >
              Generate New Backup Codes
            </Button>
            
            <Alert severity="warning">
              Backup codes are one-time use only. Store them securely and generate new ones if you run out.
            </Alert>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );

  const renderUserManagement = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          User 2FA Status
        </Typography>
        
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>2FA Status</TableCell>
                <TableCell>Methods</TableCell>
                <TableCell>Backup Codes</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userStatuses.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {user.userName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {user.userName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.userEmail}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isEnabled ? 'Enabled' : 'Disabled'}
                      color={user.isEnabled ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      {user.methods.map((method) => (
                        <Tooltip key={method} title={method}>
                          <Iconify
                            icon={getMethodIcon(method as TwoFactorMethod['type'])}
                            width={20}
                          />
                        </Tooltip>
                      ))}
                      {user.methods.length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                          None
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {user.isEnabled ? (
                      <Typography variant="body2">
                        {user.backupCodesUsed}/{user.totalBackupCodes} used
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        N/A
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? (
                      <Typography variant="body2">
                        {format(new Date(user.lastLogin), 'MMM dd, yyyy HH:mm')}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Never
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Reset 2FA">
                        <IconButton
                          size="small"
                          onClick={() => enqueueSnackbar('2FA reset for user', { variant: 'info' })}
                        >
                          <Iconify icon="eva:refresh-fill" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Generate Backup Codes">
                        <IconButton
                          size="small"
                          onClick={() => enqueueSnackbar('Backup codes generated for user', { variant: 'success' })}
                        >
                          <Iconify icon="eva:shield-fill" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderActivityLogs = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          2FA Activity Logs
        </Typography>
        
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>IP Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.userName}</TableCell>
                  <TableCell>
                    {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Iconify
                        icon={getMethodIcon(log.method as TwoFactorMethod['type'])}
                        width={16}
                      />
                      <Typography variant="body2">
                        {log.method.charAt(0).toUpperCase() + log.method.slice(1)}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      color={getStatusColor(log.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {log.ipAddress}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Stack spacing={3}>
        <Typography variant="h4">Two-Factor Authentication</Typography>
        
        <Alert severity="warning">
          Two-factor authentication adds an extra layer of security to your account. Enable at least one method to protect against unauthorized access.
        </Alert>

        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="My Settings" />
          <Tab label="User Management" />
          <Tab label="Activity Logs" />
        </Tabs>

        {currentTab === 0 && renderMethodsConfiguration()}
        {currentTab === 1 && renderUserManagement()}
        {currentTab === 2 && renderActivityLogs()}
      </Stack>

      {/* Setup Dialog */}
      <Dialog
        open={setupDialogOpen}
        onClose={() => setSetupDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Setup {selectedMethod?.name}
        </DialogTitle>
        <DialogContent>
          {selectedMethod && (
            <Stack spacing={3}>
              {selectedMethod.type === 'authenticator' && (
                <>
                  <Typography variant="body2">
                    1. Download an authenticator app like Google Authenticator or Authy
                  </Typography>
                  <Typography variant="body2">
                    2. Scan this QR code with your authenticator app:
                  </Typography>
                  <Box display="flex" justifyContent="center">
                    <Paper
                      variant="outlined"
                      sx={{
                        width: 200,
                        height: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'background.neutral'
                      }}
                    >
                      <Stack alignItems="center" spacing={1}>
                        <Iconify icon="eva:qr-code-fill" width={48} />
                        <Typography variant="caption">QR Code</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {qrSecret}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Box>
                  <Typography variant="body2">
                    3. Enter the 6-digit code from your authenticator app:
                  </Typography>
                  <TextField
                    fullWidth
                    label="Verification Code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="000000"
                    inputProps={{ maxLength: 6 }}
                  />
                </>
              )}
              
              {selectedMethod.type === 'sms' && (
                <>
                  <Typography variant="body2">
                    Enter your phone number to receive SMS verification codes:
                  </Typography>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    placeholder="+1 (555) 123-4567"
                  />
                </>
              )}
              
              {selectedMethod.type === 'email' && (
                <Typography variant="body2">
                  Email verification will be sent to your registered email address: admin@furnerio.com
                </Typography>
              )}
              
              {selectedMethod.type === 'backup_codes' && (
                <Typography variant="body2">
                  Generate 10 backup codes that can be used when your primary 2FA method is unavailable.
                </Typography>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSetupDialogOpen(false)}>Cancel</Button>
          <LoadingButton
            loading={loading}
            variant="contained"
            onClick={handleSetupMethod}
          >
            Setup
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Backup Codes Dialog */}
      <Dialog
        open={showBackupCodes}
        onClose={() => setShowBackupCodes(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Backup Codes</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Alert severity="warning">
              Save these backup codes in a secure location. Each code can only be used once.
            </Alert>
            
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={1}>
                {backupCodes.map((code, index) => (
                  <Grid item xs={6} key={index}>
                    <Typography variant="body2" fontFamily="monospace">
                      {index + 1}. {code}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Paper>
            
            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:download-fill" />}
              onClick={() => {
                const element = document.createElement('a');
                const file = new Blob([backupCodes.join('\n')], { type: 'text/plain' });
                element.href = URL.createObjectURL(file);
                element.download = 'furnerio-backup-codes.txt';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
            >
              Download Codes
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBackupCodes(false)} variant="contained">
            I've Saved These Codes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

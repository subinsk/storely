'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  IconButton,
  InputAdornment,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Visibility, VisibilityOff, Close } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { LoginCredentials, RegisterCredentials } from '../../types/user';

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthDialog = ({ open, onClose, initialMode = 'login' }: AuthDialogProps) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  const { login, register } = useAuth();

  const [loginForm, setLoginForm] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState<RegisterCredentials>({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [forgotEmail, setForgotEmail] = useState('');

  const handleClose = () => {
    setError('');
    setSuccess('');
    setLoginForm({ email: '', password: '' });
    setRegisterForm({ name: '', email: '', password: '', phone: '' });
    setForgotEmail('');
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await login(loginForm);
      
      if (response.success) {
        handleClose();
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await register(registerForm);
      
      if (response.success) {
        handleClose();
      } else {
        setError(response.error || 'Registration failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password reset email sent successfully');
        setForgotEmail('');
      } else {
        setError(data.message || 'Failed to send reset email');
      }
    } catch (error) {
      setError('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={loginForm.email}
        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
        margin="normal"
        required
        autoComplete="email"
        autoFocus
      />
      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={loginForm.password}
        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
        margin="normal"
        required
        autoComplete="current-password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{ mt: 3, mb: 2 }}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>
      
      <Box sx={{ textAlign: 'center' }}>
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={() => setMode('forgot')}
          sx={{ mr: 2 }}
        >
          Forgot Password?
        </Link>
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={() => setMode('register')}
        >
          Don't have an account? Sign Up
        </Link>
      </Box>
    </Box>
  );

  const renderRegisterForm = () => (
    <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Full Name"
        value={registerForm.name}
        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
        margin="normal"
        required
        autoComplete="name"
        autoFocus
      />
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={registerForm.email}
        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
        margin="normal"
        required
        autoComplete="email"
      />
      <TextField
        fullWidth
        label="Phone (Optional)"
        value={registerForm.phone}
        onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
        margin="normal"
        autoComplete="tel"
      />
      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={registerForm.password}
        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
        margin="normal"
        required
        autoComplete="new-password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{ mt: 3, mb: 2 }}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
      
      <Box sx={{ textAlign: 'center' }}>
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={() => setMode('login')}
        >
          Already have an account? Sign In
        </Link>
      </Box>
    </Box>
  );

  const renderForgotForm = () => (
    <Box component="form" onSubmit={handleForgotPassword} sx={{ mt: 2 }}>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Enter your email address and we'll send you a link to reset your password.
      </Typography>
      
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={forgotEmail}
        onChange={(e) => setForgotEmail(e.target.value)}
        margin="normal"
        required
        autoComplete="email"
        autoFocus
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{ mt: 3, mb: 2 }}
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </Button>
      
      <Box sx={{ textAlign: 'center' }}>
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={() => setMode('login')}
        >
          Back to Sign In
        </Link>
      </Box>
    </Box>
  );

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return 'Sign In';
      case 'register':
        return 'Create Account';
      case 'forgot':
        return 'Reset Password';
      default:
        return 'Sign In';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">{getTitle()}</Typography>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        
        {mode === 'login' && renderLoginForm()}
        {mode === 'register' && renderRegisterForm()}
        {mode === 'forgot' && renderForgotForm()}
      </DialogContent>
    </Dialog>
  );
};

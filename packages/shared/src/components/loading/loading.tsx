import React from 'react'
import { Box, CircularProgress, LinearProgress } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

interface LoadingSpinnerProps {
  size?: number
  color?: 'primary' | 'secondary' | 'inherit'
  thickness?: number
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color = 'primary',
  thickness = 3.6,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <CircularProgress size={size} color={color} thickness={thickness} />
    </Box>
  )
}

interface LoadingBarProps {
  variant?: 'determinate' | 'indeterminate'
  value?: number
  color?: 'primary' | 'secondary' | 'inherit'
  sx?: any
}

export const LoadingBar: React.FC<LoadingBarProps> = ({
  variant = 'indeterminate',
  value,
  color = 'primary',
  sx,
}) => {
  return (
    <LinearProgress
      variant={variant}
      value={value}
      color={color}
      sx={{
        height: 4,
        borderRadius: 2,
        ...sx,
      }}
    />
  )
}

interface FullPageLoadingProps {
  message?: string
}

export const FullPageLoading: React.FC<FullPageLoadingProps> = ({
  message = 'Loading...',
}) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: alpha(theme.palette.background.default, 0.8),
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
      }}
    >
      <LoadingSpinner size={60} />
      {message && (
        <Box sx={{ mt: 2, color: 'text.secondary' }}>
          {message}
        </Box>
      )}
    </Box>
  )
}

interface OverlayLoadingProps {
  loading: boolean
  children: React.ReactNode
  message?: string
}

export const OverlayLoading: React.FC<OverlayLoadingProps> = ({
  loading,
  children,
  message,
}) => {
  const theme = useTheme()

  return (
    <Box sx={{ position: 'relative' }}>
      {children}
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(4px)',
            borderRadius: 1,
            zIndex: 1,
          }}
        >
          <LoadingSpinner />
          {message && (
            <Box sx={{ mt: 2, color: 'text.secondary', fontSize: 14 }}>
              {message}
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

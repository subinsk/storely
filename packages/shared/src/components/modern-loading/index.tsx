import { alpha, keyframes } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

// Smooth fade animation
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Pulse animation for loading states
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

interface ModernLoadingProps {
  size?: number;
  message?: string;
  fullScreen?: boolean;
}

export default function ModernLoading({ 
  size = 40, 
  message = "Loading...", 
  fullScreen = false 
}: ModernLoadingProps) {
  const content = (
    <Stack 
      alignItems="center" 
      spacing={2}
      sx={{
        animation: `${fadeIn} 0.5s ease-out`,
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CircularProgress 
          size={size}
          thickness={4}
          sx={{
            color: 'primary.main',
            animation: `${pulse} 2s ease-in-out infinite`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: size * 0.6,
              height: size * 0.6,
              borderRadius: '50%',
              background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.3)} 100%)`,
            }}
          />
        </Box>
      </Box>
      
      {message && (
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            fontWeight: 500,
            animation: `${fadeIn} 0.5s ease-out 0.2s both`,
          }}
        >
          {message}
        </Typography>
      )}
    </Stack>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: (theme) => alpha(theme.palette.background.default, 0.9),
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      {content}
    </Box>
  );
}

// Skeleton component with modern styling
export function ModernSkeleton({ 
  variant = "rectangular", 
  width = "100%", 
  height = 20,
  borderRadius = 1,
  ...props 
}: any) {
  const shimmer = keyframes`
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  `;

  return (
    <Box
      sx={{
        width,
        height,
        borderRadius,
        background: (theme) => `linear-gradient(90deg, ${theme.palette.grey[200]} 0px, ${alpha(theme.palette.grey[100], 0.8)} 40px, ${theme.palette.grey[200]} 80px)`,
        backgroundSize: '200px 100%',
        animation: `${shimmer} 1.5s ease-in-out infinite`,
        ...props.sx,
      }}
      {...props}
    />
  );
}

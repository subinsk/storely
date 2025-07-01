// Theme CSS utilities - stub implementation

export const bgBlur = (color?: string, opacity?: number) => ({
  backdropFilter: 'blur(6px)',
  backgroundColor: color || 'rgba(255, 255, 255, 0.8)',
})

export const hideScroll = {
  overflow: 'auto',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}

export const paper = {
  backgroundColor: '#ffffff',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
}

export const bgGradient = (color?: string) => ({
  background: `linear-gradient(135deg, ${color || '#2196f3'} 0%, ${color || '#1976d2'} 100%)`,
})

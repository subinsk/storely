// ----------------------------------------------------------------------

export function grid(theme: any) {
  return {
    MuiGrid: {
      styleOverrides: {
        root: {
          // Ensure proper box sizing
          boxSizing: 'border-box',
        },
        container: {
          // Fix any potential width issues
          width: '100%',
          // Reset margin to prevent overflow
          marginLeft: '0 !important',
          marginTop: '0 !important',
          // Ensure proper width calculation
          '&.MuiGrid-container': {
            width: '100%',
          },
        },
        item: {
          // Ensure proper item sizing
          boxSizing: 'border-box',
          // Prevent items from overflowing
          maxWidth: '100%',
        },
        // Fix spacing issues
        spacing0: {
          '& > .MuiGrid-item': {
            padding: 0,
          },
        },
      },
    },
  };
}

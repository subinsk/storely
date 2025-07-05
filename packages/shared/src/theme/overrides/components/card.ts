// ----------------------------------------------------------------------

export function card(theme: any) {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          position: "relative",
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          borderRadius: 16,
          zIndex: 0,
          border: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create(['box-shadow', 'transform'], {
            duration: theme.transitions.duration.shorter,
          }),
          '&:hover': {
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
          },
          // Ensure no text decoration when used as Link
          textDecoration: 'none !important',
          '& a, & [role="link"]': {
            textDecoration: 'none !important',
            color: 'inherit',
          },
          '&:hover a, &:hover [role="link"]': {
            textDecoration: 'none !important',
          },
          '&:focus a, &:focus [role="link"]': {
            textDecoration: 'none !important',
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 3, 2),
        },
        title: {
          fontSize: '1.125rem',
          fontWeight: 600,
        },
        subheader: {
          fontSize: '0.875rem',
          marginTop: theme.spacing(0.5),
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(0, 3, 3),
          '&:last-child': {
            paddingBottom: theme.spacing(3),
          },
        },
      },
    },
  };
}

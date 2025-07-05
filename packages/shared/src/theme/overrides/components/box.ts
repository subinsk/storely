// ----------------------------------------------------------------------

export function box(theme: any) {
  return {
    MuiBox: {
      styleOverrides: {
        root: {
          // When Box is used as a link component
          '&[component="a"], &[href]': {
            textDecoration: 'none !important',
            '&:hover': {
              textDecoration: 'none !important',
            },
            '&:focus': {
              textDecoration: 'none !important',
            },
            '&:visited': {
              textDecoration: 'none !important',
            },
            '&:active': {
              textDecoration: 'none !important',
            },
          },
          // When Box contains link elements
          '& a, & [href], & [role="link"]': {
            textDecoration: 'none !important',
            '&:hover': {
              textDecoration: 'none !important',
            },
            '&:focus': {
              textDecoration: 'none !important',
            },
          },
        },
      },
    },
  };
}

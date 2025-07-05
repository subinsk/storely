// ----------------------------------------------------------------------

export function stack(theme: any) {
  return {
    MuiStack: {
      styleOverrides: {
        root: {
          // When Stack is used as a link component
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
          // When Stack contains link elements
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

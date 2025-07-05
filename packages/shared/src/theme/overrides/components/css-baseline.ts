// ----------------------------------------------------------------------

export function cssBaseline(theme: any) {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
          // Global override for any text decoration
          '&[href]': {
            textDecoration: "none !important",
          },
        },
        html: {
          margin: 0,
          padding: 0,
          width: "100%",
          height: "100%",
          WebkitOverflowScrolling: "touch",
        },
        body: {
          margin: 0,
          padding: 0,
          width: "100%",
          height: "100%",
        },
        "#root, #__next": {
          width: "100%",
          height: "100%",
        },
        input: {
          "&[type=number]": {
            MozAppearance: "textfield",
            "&::-webkit-outer-spin-button": {
              margin: 0,
              WebkitAppearance: "none",
            },
            "&::-webkit-inner-spin-button": {
              margin: 0,
              WebkitAppearance: "none",
            },
          },
        },
        img: {
          maxWidth: "100%",
          display: "inline-block",
          verticalAlign: "bottom",
        },
        a: {
          textDecoration: "none !important",
          "&:hover": {
            textDecoration: "none !important",
          },
          "&:focus": {
            textDecoration: "none !important",
          },
          "&:visited": {
            textDecoration: "none !important",
          },
          "&:active": {
            textDecoration: "none !important",
          },
        },
        '[role="link"]': {
          textDecoration: "none !important",
          "&:hover": {
            textDecoration: "none !important",
          },
          "&:focus": {
            textDecoration: "none !important",
          },
        },
      },
    },
  };
}

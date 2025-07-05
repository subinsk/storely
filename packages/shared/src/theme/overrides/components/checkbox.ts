// ----------------------------------------------------------------------

export function checkbox(theme: any) {
  return {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: "0px 6px 0px 0px",
          "&:hover": {
            backgroundColor: "transparent",
          },
          "& .MuiSvgIcon-root": {
            width: "16px",
            height: "16px",
          },
        },
      },
    },
  };
}

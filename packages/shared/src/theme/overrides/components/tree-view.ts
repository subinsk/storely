// ----------------------------------------------------------------------

export function treeView(theme: any) {
  return {
    MuiTreeItem: {
      styleOverrides: {
        label: {
          ...theme.typography.body2,
        },
        iconContainer: {
          width: "auto",
        },
      },
    },
  };
}

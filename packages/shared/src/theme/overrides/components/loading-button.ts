import { loadingButtonClasses } from "@mui/lab/LoadingButton";

// ----------------------------------------------------------------------

export function loadingButton(theme: any) {
  return {
    MuiLoadingButton: {
      styleOverrides: {
        root: ({
          ownerState,
        }: {
          ownerState: {
            variant: string;
            size: string;
          };
        }) => ({
          ...(ownerState.variant === "soft" && {
            [`& .${loadingButtonClasses.loadingIndicatorStart}`]: {
              left: 10,
            },
            [`& .${loadingButtonClasses.loadingIndicatorEnd}`]: {
              right: 14,
            },
            ...(ownerState.size === "small" && {
              [`& .${loadingButtonClasses.loadingIndicatorStart}`]: {
                left: 10,
              },
              [`& .${loadingButtonClasses.loadingIndicatorEnd}`]: {
                right: 10,
              },
            }),
          }),
        }),
      },
    },
  };
}

import PropTypes from "prop-types";
// @mui
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import StepLabel, { stepLabelClasses } from "@mui/material/StepLabel";
import MuiStepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
// components
import {Iconify} from"@storely/shared/components/iconify";

// ----------------------------------------------------------------------

const StepConnector = styled(MuiStepConnector)(({ theme }: { theme: any }) => ({
  top: 10,
  left: "calc(-50% + 20px)",
  right: "calc(50% + 20px)",
  [`& .${stepConnectorClasses.line}`]: {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  [`&.${stepConnectorClasses.active}, &.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
}));

// ----------------------------------------------------------------------

export default function CheckoutSteps({
  steps,
  activeStep,
  sx,
  ...other
}: {
  steps: any;
  activeStep: any;
  sx?: any;
  [x: string]: any;
}) {
  return (
    <Stepper
      alternativeLabel
      activeStep={activeStep}
      connector={<StepConnector />}
      sx={{
        mb: { xs: 3, md: 5 },
        ...sx,
      }}
      {...other}
    >
      {steps.map((label: any) => (
        <Step key={label}>
          <StepLabel
            StepIconComponent={StepIcon}
            sx={{
              [`& .${stepLabelClasses.label}`]: {
                fontWeight: "fontWeightSemiBold",
              },
            }}
          >
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

CheckoutSteps.propTypes = {
  activeStep: PropTypes.number,
  steps: PropTypes.arrayOf(PropTypes.string),
  sx: PropTypes.object,
};

// ----------------------------------------------------------------------

function StepIcon({ active, completed }: { active: any; completed: any }) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        width: 24,
        height: 24,
        color: "text.disabled",
        ...(active && {
          color: "primary.main",
        }),
      }}
    >
      {completed ? (
        <Iconify icon="eva:checkmark-fill" sx={{ color: "primary.main" }} />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "currentColor",
          }}
        />
      )}
    </Stack>
  );
}

StepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
};

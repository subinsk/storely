import PropTypes from "prop-types";
// @mui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

// components
import Label from "@/components/label";

// ----------------------------------------------------------------------

export default function AddressItem({
  address,
  action,
  sx,
  ...other
}: {
  address: any;
  action: any;
  sx: any;
  [x: string]: any;
}) {
  const { name, phone, pincode, house, street, landmark, city, state, country, type, default: isDefault, deliveryDays, additionalInfo } = address;

  const fullAddress = `${house}, ${street}, ${landmark}, ${city}, ${state}, ${country}, ${pincode}`;
  return (
    <Stack
      component={Paper}
      spacing={2}
      alignItems={{ md: "flex-end" }}
      direction={{ xs: "column", md: "row" }}
      sx={{
        position: "relative",
        ...sx,
      }}
      {...other}
    >
      <Stack flexGrow={1} spacing={1}>
        <Stack direction="row" alignItems="center">
          <Typography variant="subtitle2">
            {name}
            <Box
              component="span"
              sx={{ ml: 0.5, typography: "body2", color: "text.secondary" }}
            >
              ({type})
            </Box>
          </Typography>

          {isDefault && (
            <Label color="info" sx={{ ml: 1 }}>
              Default
            </Label>
          )}
        </Stack>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {fullAddress}
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {phone}
        </Typography>
      </Stack>

      {action && action}
    </Stack>
  );
}

AddressItem.propTypes = {
  action: PropTypes.node,
  address: PropTypes.object,
  sx: PropTypes.object,
};

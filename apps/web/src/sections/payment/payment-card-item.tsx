import PropTypes from "prop-types";
// @mui
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
// components
import Label from "@storely/shared/components/label";
import {Iconify} from"@storely/shared/components/iconify";
import CustomPopover, { usePopover } from "@storely/shared/components/custom-popover";

// ----------------------------------------------------------------------

export default function PaymentCardItem({
  card,
  sx,
  ...other
}: {
  card: any;
  sx?: any;
  [x: string]: any;
}) {
  const popover = usePopover();

  return (
    <>
      <Stack
        spacing={1}
        component={Paper}
        variant="outlined"
        sx={{
          p: 2.5,
          width: 1,
          position: "relative",
          ...sx,
        }}
        {...other}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify
            icon={
              (card.cardType === "visa" && "logos:visa") || "logos:mastercard"
            }
            width={36}
          />

          {card.primary && <Label color="info">Default</Label>}
        </Stack>

        <Typography variant="subtitle2">{card.cardNumber}</Typography>

        <IconButton
          onClick={popover.onOpen}
          sx={{
            top: 8,
            right: 8,
            position: "absolute",
          }}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>

      <CustomPopover open={popover.open} onClose={popover.onClose}>
        <MenuItem onClick={popover.onClose}>
          <Iconify icon="eva:star-fill" />
          Set as primary
        </MenuItem>

        <MenuItem onClick={popover.onClose}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem onClick={popover.onClose} sx={{ color: "error.main" }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}

PaymentCardItem.propTypes = {
  card: PropTypes.object,
  sx: PropTypes.object,
};

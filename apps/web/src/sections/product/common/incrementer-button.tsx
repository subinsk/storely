import PropTypes from "prop-types";
import { forwardRef } from "react";
// @mui
import { alpha } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
// components
import {Iconify} from"@storely/shared/components/iconify";

// ----------------------------------------------------------------------

const IncrementerButton = forwardRef(
  (
    {
      quantity,
      onIncrease,
      onDecrease,
      disabledIncrease,
      disabledDecrease,
      sx,
      ...other
    }: {
      quantity: number;
      onIncrease: () => void;
      onDecrease: () => void;
      disabledIncrease: boolean;
      disabledDecrease: boolean;
      sx: object;
      [key: string]: any;
    },
    ref
  ) => (
    <Stack
      ref={ref}
      flexShrink={0}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        p: 0.5,
        width: 88,
        borderRadius: 1,
        typography: "subtitle2",
        border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.2)}`,
        ...sx,
      }}
      {...other}
    >
      <IconButton
        size="small"
        onClick={onDecrease}
        disabled={disabledDecrease}
        sx={{ borderRadius: 0.75 }}
      >
        <Iconify icon="eva:minus-fill" width={16} />
      </IconButton>

      {quantity}

      <IconButton
        size="small"
        onClick={onIncrease}
        disabled={disabledIncrease}
        sx={{ borderRadius: 0.75 }}
      >
        <Iconify icon="mingcute:add-line" width={16} />
      </IconButton>
    </Stack>
  )
);

IncrementerButton.displayName = "IncrementerButton";

IncrementerButton.propTypes = {
  disabledDecrease: PropTypes.bool,
  disabledIncrease: PropTypes.bool,
  onDecrease: PropTypes.func,
  onIncrease: PropTypes.func,
  quantity: PropTypes.number,
  sx: PropTypes.object,
};

export default IncrementerButton;

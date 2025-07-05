import PropTypes from 'prop-types';
// @mui
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
// components
import { Iconify } from '@storely/shared/components/iconify';
import CustomPopover, { usePopover } from '@storely/shared/components/custom-popover';

// ----------------------------------------------------------------------

export default function AddressItem({ 
  address,
  onEdit,
  onDelete,
  sx,
  ...other
}: {
  address: any;
  onEdit?: VoidFunction;
  onDelete?: VoidFunction;
  sx?: any;
  [x: string]: any;
}) {
  const popover = usePopover();

  return (
    <>
      <Stack
        component={Paper}
        spacing={1.5}
        sx={{
          p: 2.5,
          width: 1,
          position: 'relative',
          ...sx,
        }}
        {...other}
      >
        <Stack spacing={0.5}>
          <Stack direction="row" alignItems="center">
            <Typography variant="subtitle2">
              {address.name}
            </Typography>

            {address.primary && (
              <Typography
                variant="caption"
                sx={{
                  px: 0.75,
                  py: 0.25,
                  ml: 1,
                  borderRadius: 1,
                  bgcolor: 'primary.lighter',
                  color: 'primary.main',
                }}
              >
                Default
              </Typography>
            )}
          </Stack>

          <Typography variant="body2">
            {address.fullAddress}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {address.phoneNumber}
          </Typography>
        </Stack>

        <IconButton
          onClick={popover.onOpen}
          sx={{
            top: 8,
            right: 8,
            position: 'absolute',
          }}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            onEdit?.();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onDelete?.();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}

AddressItem.propTypes = {
  address: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  sx: PropTypes.object,
};

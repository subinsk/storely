import PropTypes from 'prop-types';
// @mui
import List from '@mui/material/List';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
// components
import { useSnackbar } from '@storely/shared/components/snackbar';
import AddressItem from './address-item';

// ----------------------------------------------------------------------

export default function AddressListDialog({
  open,
  onClose,
  selected,
  onSelect,
  addresses,
  ...other
}: {
  open: boolean;
  onClose: VoidFunction;
  selected: (selectedId: string) => boolean;
  onSelect: (address: any) => void;
  addresses: any[];
  [x: string]: any;
}) {
  const { enqueueSnackbar } = useSnackbar();

  const handleSelect = (address: any) => {
    onSelect(address);
    enqueueSnackbar('Address selected!');
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle>Select Address</DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>
        <List>
          {addresses.map((address) => (
            <AddressItem
              key={address.id}
              address={address}
              onClick={() => handleSelect(address)}
              sx={{
                p: 2.5,
                mb: 2,
                cursor: 'pointer',
                ...(selected(address.id) && {
                  bgcolor: 'action.selected',
                }),
              }}
            />
          ))}
        </List>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddressListDialog.propTypes = {
  addresses: PropTypes.array,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  selected: PropTypes.func,
};

import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

// AddressItem component
export function AddressItem({ address, action, ...props }: {
  address: any;
  action?: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <Card variant={props.variant || 'outlined'} sx={props.sx}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack>
          <div>{address.name}</div>
          <div>{address.street}, {address.city}, {address.state}, {address.zip}</div>
          <div>{address.country}</div>
        </Stack>
        {action}
      </Stack>
    </Card>
  );
}

// AddressNewForm component
export function AddressNewForm({ open, onClose, onCreate }: {
  open: boolean;
  onClose: () => void;
  onCreate: (address: any) => void;
}) {
  const [form, setForm] = React.useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onCreate(form);
    setForm({ name: '', street: '', city: '', state: '', zip: '', country: '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Address</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField name="name" label="Name" value={form.name} onChange={handleChange} fullWidth />
          <TextField name="street" label="Street" value={form.street} onChange={handleChange} fullWidth />
          <TextField name="city" label="City" value={form.city} onChange={handleChange} fullWidth />
          <TextField name="state" label="State" value={form.state} onChange={handleChange} fullWidth />
          <TextField name="zip" label="Zip" value={form.zip} onChange={handleChange} fullWidth />
          <TextField name="country" label="Country" value={form.country} onChange={handleChange} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Add</Button>
      </DialogActions>
    </Dialog>
  );
}

AddressItem.propTypes = {
  address: PropTypes.object.isRequired,
  action: PropTypes.node,
};

AddressNewForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

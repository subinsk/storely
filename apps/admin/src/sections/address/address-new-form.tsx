import { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
// components
import {FormProvider, RHFTextField, RHFCheckbox} from '@storely/shared/components/hook-form';

// ----------------------------------------------------------------------

export default function AddressNewForm({
  open,
  onClose,
  onCreate,
  address,
  ...other
}: {
  open: boolean;
  onClose: VoidFunction;
  onCreate: (address: any) => void;
  address?: any;
  [x: string]: any;
}) {
  const NewAddressSchema = Yup.object().shape({
    name: Yup.string().required('Full name is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    zipCode: Yup.string().required('Zip code is required'),
    primary: Yup.boolean(),
  });

  const defaultValues = {
    name: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    primary: false,
  };

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (address) {
      reset({
        name: address.name || '',
        phoneNumber: address.phoneNumber || '',
        address: address.address || '',
        city: address.city || '',
        state: address.state || '',
        country: address.country || '',
        zipCode: address.zipCode || '',
        primary: address.primary || false,
      });
    }
  }, [address, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      onCreate({
        ...data,
        fullAddress: `${data.address}, ${data.city}, ${data.state}, ${data.country}, ${data.zipCode}`,
      });
      onClose();
      reset();
    } catch (error) {
      console.error(error);
    }
  });

  const handleClose = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose} {...other}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{address ? 'Edit Address' : 'Add New Address'}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            <RHFTextField name="name" label="Full Name" />

            <RHFTextField name="phoneNumber" label="Phone Number" />

            <RHFTextField name="address" label="Address" />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField name="city" label="City" />
              <RHFTextField name="state" label="State" />
              <RHFTextField name="zipCode" label="Zip/Code" />
            </Stack>

            <RHFTextField name="country" label="Country" />

            <RHFCheckbox name="primary" label="Use this address as default." helperText="" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={handleClose}>
            Cancel
          </Button>

          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {address ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

AddressNewForm.propTypes = {
  address: PropTypes.object,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  open: PropTypes.bool,
};

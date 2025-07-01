import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
// hooks
import { useBoolean } from '@/hooks/use-boolean';

// components
import Iconify from '@/components/iconify';
import CustomPopover, { usePopover } from '@/components/custom-popover';
//
import { AddressNewForm, AddressItem } from '../address';
import EmptyContent from '@/components/empty-content';
import { useSnackbar } from 'notistack';
import { deleteAddress, updateAddress } from '@/services/user.service';

// ----------------------------------------------------------------------

export default function AccountBillingAddress({ addresses, mutate }:{
  addresses: any;
  mutate: any
}) {
  const [addressId, setAddressId] = useState('');

  const popover = usePopover();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const addressForm = useBoolean();

  const handleAddNewAddress = useCallback((address:any) => {
    console.info('ADDRESS', address);
  }, []);

  const handleSetDefaultAddress = useCallback(async(id:any) => {
    try{
      const snackbarId = enqueueSnackbar("Setting address to default", { variant: "info"})
      const payload={
        id,
        default: true
      }

      const response = await updateAddress(payload, { item: "default" })

      closeSnackbar(snackbarId)

      if(response.success){
        enqueueSnackbar('Address set as default', { variant: 'success' });
        mutate()
      } else throw new Error(response.message)
    }
    catch(e: any){
      enqueueSnackbar(e.message, { variant: 'error' });
    }
  }, [
    enqueueSnackbar,
closeSnackbar,
mutate
  ]);

  const handleDeleteAddress = useCallback(async() => {
    try{
      const response = await deleteAddress(addressId)

      if(response.success){
        enqueueSnackbar('Address deleted successfully', { variant: 'success' });
      } else throw new Error(response.message)
    }
    catch(e: any){
      enqueueSnackbar(e.message, { variant: 'error' });
    }
  }, [
    addressId,
    enqueueSnackbar,
  ]);

  const handleSelectedId = useCallback(
    (event: any, id: any) => {
      popover.onOpen(event);
      setAddressId(id);
    },
    [popover]
  );

  const handleClose = useCallback(() => {
    popover.onClose();
    setAddressId('');
  }, [popover]);

  return (
    <>
      <Card>
        <CardHeader
          title="Address Book"
          action={
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={addressForm.onTrue}
            >
              Address
            </Button>
          }
        />

        <Stack spacing={2.5} sx={{ p: 3 }}>
          {addresses.length ? addresses.map((address:any) => (
            <AddressItem
              variant="outlined"
              key={address.id}
              address={address}
              action={
                <IconButton
                  onClick={(event) => {
                    handleSelectedId(event, `${address.id}`);
                  }}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              }
              sx={{
                p: 2.5,
                borderRadius: 1,
              }}
            />
          )):
          <EmptyContent title='No Addresses added yet. Please add one.'/>
          
          }
        </Stack>
      </Card>

      <CustomPopover open={popover.open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleSetDefaultAddress(addressId);
            handleClose();
          }}
        >
          <Iconify icon="eva:star-fill" />
          Set as default
        </MenuItem>

        <MenuItem
          onClick={() => {
           addressForm.onTrue()
            handleClose();
            console.info('EDIT', addressId);
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleDeleteAddress()
            handleClose();
            console.info('DELETE', addressId);
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <AddressNewForm
        open={addressForm.value}
        onClose={addressForm.onFalse}
        onCreate={handleAddNewAddress}
        selectedAddresId={addressId}
      />
    </>
  );
}

AccountBillingAddress.propTypes = {
  addresses: PropTypes.array,
};

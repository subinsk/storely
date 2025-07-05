"use client"

import PropTypes from "prop-types";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

// assets
import { countries } from "@/assets/data";
// components
import {Iconify} from"@storely/shared/components/iconify";
import FormProvider, {
  RHFCheckbox,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
} from "@storely/shared/components/hook-form";
import Scrollbar from "@storely/shared/components/scrollbar";
import { useCallback, useEffect, useState } from "react";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import { createAddress, getAddress } from "@/services/user.service";
import useGetUser from "@/hooks/use-get-user";
import { useSnackbar } from "notistack";

// ----------------------------------------------------------------------

export default function AddressNewForm({
  open,
  onClose,
  selectedAddresId
}: {
  open: boolean;
  onClose: any;
  selectedAddresId?: string
}) {
  // states
  const [address, setAddress] = useState<any>(null);

  const NewAddressSchema = Yup.object().shape({
    name: Yup.string().required("Fullname is required"),
    phone: Yup.string().required("Phone number is required"),
    house: Yup.string().required("House is required"),
    street: Yup.string(),
    landmark: Yup.string(),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    pincode: Yup.string().required("Zip code is required"),
    type: Yup.string().required("Address Type is required"),
    additionalInfo: Yup.string(),
  });

   const defaultValues = {
    name: address?.name || "",
    phone: address?.phone || "",
    house: address?.house || "",
    street: address?.street || "",
    landmark: address?.landmark || "",
    city: address?.city || "",
    state: address?.state || "",
    country: address?.country || "",
    pincode: address?.pincode || "",
    type: address?.type || "Home",
    default: address?.default || false,
    additionalInfo: address?.additionalInfo || "",
  };

  const user = useGetUser()
  const {enqueueSnackbar} = useSnackbar();

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [deliveryDays, setDeliveryDays] = useState<string[]>(days);
  
  // functions
  const fetchAddress = useCallback(async()=>{
    try{
      if(!selectedAddresId) return;

      const response = await getAddress(selectedAddresId);

      if(response.success){
        setAddress(response.data);
      }
      else throw new Error(response.message);
    }
    catch(e: any){
      console.error(e);
    }
  },[
    selectedAddresId
  ])

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('data')
      const payload = {
        userId: user.id,
        ...data,
      }

      const response = await createAddress(payload);

      if(response.success){
        enqueueSnackbar("Address added successfully", {variant: "success"})
      }
      else throw new Error(response.message);
      onClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to add address", {variant: "error"})
    }
  });
  
  // effects
  useEffect(() => {
    if(selectedAddresId){
      fetchAddress();
    }
  },[
    selectedAddresId,
    fetchAddress
  ])

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>New address</DialogTitle>

        <DialogContent dividers>
          <Scrollbar sx={
            {
              height: 350,
              px: 1.5
            }
          }>
            <Stack spacing={3}>
              <RHFRadioGroup
                row
                name="type"
                options={[
                  { label: "Home", value: "Home" },
                  { label: "Office", value: "Office" },
                  { label: "Other", value: "Other" },
                ]}
              />

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                }}
              >
                <RHFTextField name="name" label="Full Name"/>

                <RHFTextField name="phone" label="Phone Number" />
              </Box>

              <RHFTextField name="house" label="Flat, House no., Building, Company, Apartment" />
              <RHFTextField name="street" label="Area, Street, Sector, Village" />
              <RHFTextField name="landmark" label="Landmark (Optional)" />

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(3, 1fr)",
                }}
              >
                <RHFTextField name="city" label="Town / City" />

                <RHFTextField name="state" label="State" />

                <RHFTextField name="pincode" label="Pincode" />
              </Box>

              <RHFAutocomplete
                name="country"
                label="Country"
                options={countries.map((country) => country.label)}
                getOptionLabel={(option: any) => option}
                renderOption={(props: any, option: any) => {
                  const { code, label, phone } = countries.filter(
                    (country) => country.label === option
                  )[0];

                  if (!label) {
                    return null;
                  }

                  return (
                    <li {...props} key={label}>
                      <Iconify
                        key={label}
                        icon={`circle-flags:${code.toLowerCase()}`}
                        width={28}
                        sx={{ mr: 1 }}
                      />
                      {label} ({code}) +{phone}
                    </li>
                  );
                }}
              />

              <RHFCheckbox name="default" label="Use this address as default." />
              <Stack spacing={0}>
                <Typography variant="subtitle2">What are your preferred delivery days?</Typography>
              <Box
                rowGap={3}
                columnGap={1}
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(7, 1fr)",
                }}
              >
                {
                  days.map((day) => (
                    <FormControlLabel
                    key={day}
                    label={day.slice(0, 3)}
                    control={<Checkbox 
                      checked={deliveryDays.includes(day)}
                      onChange={() => {
                        if (deliveryDays.includes(day)) {
                          setDeliveryDays(deliveryDays.filter((value) => value !== day));
                        } else {
                          setDeliveryDays([...deliveryDays, day]);
                        }
                      }}
                      />}
                  />
                  ))
                }
              </Box>
            </Stack>

            <RHFTextField name="additionalInfo" label="Any other additional info to your address? (Optional)" multiline rows={5}/>
            </Stack>
          </Scrollbar>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Add address
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

AddressNewForm.propTypes = {
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  open: PropTypes.bool,
};

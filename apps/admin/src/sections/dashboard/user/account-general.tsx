import * as Yup from 'yup';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// hooks
import useGetUser from "@/hooks/use-get-user";
import { updateUserProfile, useGetUserProfile } from '@/services/user.service';
// utils
import { fData } from '@/utils/format-number';
// assets
import { countries } from '@/assets/data';
// components
import Iconify from '@/components/iconify';
import { useSnackbar } from '@/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from '@/components/hook-form';
import { imagekit } from '@/lib';
import { slugify } from '@/utils/slugify';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar, closeSnackbar} = useSnackbar();

  const currentUser = useGetUser()

  const { user, userError, userLoading, userValidating } = useGetUserProfile(currentUser?.id);

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    image: Yup.mixed().nullable().required('Avatar is required'),
    phone: Yup.string(),
  });

  const defaultValues = {
    name: user?.name || '',
    email: user?.email || '',
    image: user?.image || null,
    phone: user?.phone || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log('user; ', user)
    try {
      const response =  await updateUserProfile({
        id: user.id,
        ...data,
      });

      if(response.success){
        enqueueSnackbar('Update success!');
      }
      else throw new Error('Update failed!');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Update failed!', { variant: 'error' });
    }
  });

  const handleDrop = useCallback(
    async(acceptedFiles:any) => {
      const file = acceptedFiles[0];

      try {
        const snackbarId = enqueueSnackbar("Uploading image", {
          variant: "info",
        });

        const response = await imagekit.upload({
          file,
          fileName: "pfp",
          folder: "/furnerio/user/" + user.id + "/avatar",
          useUniqueFileName: false,          
        });

        const imageUrl = response.url;
        
        const editImageUserResponse = await updateUserProfile({
          id: user.id,
          image: imageUrl,
        });

        closeSnackbar(snackbarId)

        if(editImageUserResponse.success){
          enqueueSnackbar("Image uploaded successfully", {
            variant: "success",
          });
        }
        else throw new Error(editImageUserResponse.message)
      } catch (error) {
        enqueueSnackbar("Failed to upload image", {
          variant: "error",
        });
      }

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('image', newFile, { shouldValidate: true });
      }
    },
    [enqueueSnackbar, setValue, user?.id]
  );

  // effects
  useEffect(()=>{
    if(user){
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('phone', user.phone);
      setValue('image', user.image);
    }
  },[setValue, user])

  useEffect(()=>{
    const id = enqueueSnackbar('Loading user data', { variant: 'info' });
  
    if(!userLoading){
      closeSnackbar(id)
    }
  },[closeSnackbar, enqueueSnackbar, userLoading])

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="image"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="phone" label="Phone Number" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

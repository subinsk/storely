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
import { updateUser } from '@/services/user.service';
// utils
import { fData } from '@storely/shared/utils/format-number';
// components
import {Iconify} from '@storely/shared/components/iconify';
import { useSnackbar } from '@storely/shared/components/snackbar';
import {FormProvider, RHFSwitch, RHFTextField, RHFUploadAvatar} from '@storely/shared/components/hook-form';
import { imagekit } from '@storely/shared/lib';
import { User } from '@/types/user';

// ----------------------------------------------------------------------

export type FormValues = {
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
};

const defaultValues: FormValues = {
  name: '',
  email: '',
  phone: null,
  image: null,
};

const UpdateUserSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().required('Email is required').email('Invalid email format'),
  phone: Yup.string().nullable(),
  image: Yup.string().nullable(),
});

export default function AccountGeneral() {
  const user = useGetUser();
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<FormValues>({
    resolver: yupResolver(UpdateUserSchema) as any,
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValues) => {
    try {
      if (!user?.id) throw new Error('User ID not found');

      await updateUser(user.id, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        image: data.image,
      });

      enqueueSnackbar('Profile updated successfully');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error updating profile', { variant: 'error' });
    }
  };

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const file = acceptedFiles[0];
        if (!file) return;

        if (!user?.id) throw new Error('User ID not found');

        const previewUrl = URL.createObjectURL(file);

        setValue('image', previewUrl);
        enqueueSnackbar('Avatar updated successfully');
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Error updating avatar', { variant: 'error' });
      }
    },
    [setValue, user?.id, enqueueSnackbar]
  );

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || null,
        image: user.image || null,
      });
    }
  }, [user, reset]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="image"
              onDrop={handleDrop}
            />
            <Typography
              variant="caption"
              sx={{
                mt: 2,
                mx: 'auto',
                display: 'block',
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              Allowed *.jpeg, *.jpg, *.png, *.gif
              <br /> max size of {fData(3145728)}
            </Typography>
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

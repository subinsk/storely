import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
// components
import {Iconify} from'@storely/shared/components/iconify';
import { useSnackbar } from '@storely/shared/components/snackbar';
import FormProvider, { RHFTextField } from '@storely/shared/components/hook-form';

// ----------------------------------------------------------------------

export default function AccountSocialLinks({ socialLinks }:{
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
  };

}) {
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    facebook: socialLinks.facebook,
    instagram: socialLinks.instagram,
    linkedin: socialLinks.linkedin,
    twitter: socialLinks.twitter,
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        {Object.keys(socialLinks).map((link) => (
          <RHFTextField
            key={link}
            name={link}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    width={24}
                    icon={
                      (link === 'facebook' && 'eva:facebook-fill') ||
                      (link === 'instagram' && 'ant-design:instagram-filled') ||
                      (link === 'linkedin' && 'eva:linkedin-fill') ||
                      (link === 'twitter' && 'eva:twitter-fill') ||
                      ''
                    }
                    color={
                      (link === 'facebook' && '#1877F2') ||
                      (link === 'instagram' && '#DF3E30') ||
                      (link === 'linkedin' && '#006097') ||
                      (link === 'twitter' && '#1C9CEA') ||
                      ''
                    }
                  />
                </InputAdornment>
              ),
            }}
          />
        ))}

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Save Changes
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

AccountSocialLinks.propTypes = {
  socialLinks: PropTypes.object,
};

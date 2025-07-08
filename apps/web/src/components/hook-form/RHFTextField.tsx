import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';

interface RHFTextFieldProps extends Omit<TextFieldProps, 'name'> {
  name: string;
}

export const RHFTextField: React.FC<RHFTextFieldProps> = ({ name, ...other }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  );
};

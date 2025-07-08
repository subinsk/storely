import React from 'react';
import { FormProvider as RHFFormProvider, UseFormReturn } from 'react-hook-form';

interface FormProviderProps {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

const FormProvider: React.FC<FormProviderProps> = ({ children, methods, onSubmit }) => {
  return (
    <RHFFormProvider {...methods}>
      <form onSubmit={onSubmit}>
        {children}
      </form>
    </RHFFormProvider>
  );
};

export default FormProvider;

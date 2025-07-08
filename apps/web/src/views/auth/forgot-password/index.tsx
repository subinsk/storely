"use client";

import { useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
// @mui
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
// components
import {Iconify} from "../../../components/iconify";
import FormProvider, { RHFTextField } from "../../../components/hook-form";

// ----------------------------------------------------------------------

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Email must be a valid email address"),
});

type FormValuesProps = {
  email: string;
};

export default function ForgotPasswordView() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send reset email");
      }

      setSuccessMsg("Password reset email has been sent to your email address");
    } catch (error) {
      console.error("Forgot password error:", error);
      setErrorMsg(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Forgot your password?</Typography>

      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Please enter the email address associated with your account and we will email you a link to reset your password.
      </Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <RHFTextField name="email" label="Email address" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting || isLoading}
        startIcon={<Iconify icon="eva:email-fill" />}
      >
        Send Reset Email
      </LoadingButton>

      <Link
        href="/auth/login"
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: "center",
          display: "inline-flex",
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Return to sign in
      </Link>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {!!successMsg && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMsg}
        </Alert>
      )}

      {renderForm}
    </FormProvider>
  );
}

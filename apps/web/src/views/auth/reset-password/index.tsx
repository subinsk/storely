"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
// hooks
import { useBoolean } from "../../../hooks/use-boolean";
// components
import {Iconify} from "../../../components/iconify";
import FormProvider, { RHFTextField } from "../../../components/hook-form";

// ----------------------------------------------------------------------

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

type FormValuesProps = {
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const token = searchParams?.get("token");
  const password = useBoolean();
  const confirmPassword = useBoolean();

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setErrorMsg("Invalid reset token");
      return;
    }

    // Verify token validity
    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/verify-reset-token?token=${token}`);
        const result = await response.json();
        
        if (response.ok) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setErrorMsg(result.error || "Invalid or expired reset token");
        }
      } catch (error) {
        setTokenValid(false);
        setErrorMsg("Error verifying reset token");
      }
    };

    verifyToken();
  }, [token]);

  const onSubmit = handleSubmit(async (data) => {
    if (!token) return;

    try {
      setIsLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to reset password");
      }

      setSuccessMsg("Password reset successfully! You can now sign in with your new password.");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error) {
      console.error("Reset password error:", error);
      setErrorMsg(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Reset your password</Typography>

      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Enter your new password below.
      </Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <RHFTextField
        name="password"
        label="New Password"
        type={password.value ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? "solar:eye-bold" : "solar:eye-closed-bold"} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <RHFTextField
        name="confirmPassword"
        label="Confirm New Password"
        type={confirmPassword.value ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={confirmPassword.onToggle} edge="end">
                <Iconify icon={confirmPassword.value ? "solar:eye-bold" : "solar:eye-closed-bold"} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting || isLoading}
        disabled={!tokenValid}
        startIcon={<Iconify icon="eva:lock-fill" />}
      >
        Reset Password
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

  if (tokenValid === null) {
    return (
      <Stack spacing={3} sx={{ textAlign: "center" }}>
        <Typography variant="h6">Verifying reset token...</Typography>
      </Stack>
    );
  }

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

      {tokenValid && renderForm}

      {!tokenValid && (
        <Stack spacing={3} sx={{ textAlign: "center" }}>
          <Typography variant="body1" color="error">
            This password reset link is invalid or has expired.
          </Typography>
          <Link href="/auth/forgot-password" variant="subtitle2">
            Request a new password reset
          </Link>
        </Stack>
      )}
    </FormProvider>
  );
}

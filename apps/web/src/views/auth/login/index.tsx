"use client";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
// @mui
import LoadingButton from "@mui/lab/LoadingButton";
import MuiLink from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
// routes
import { paths } from "@/routes/paths";
import Link from "next/link";
// hooks
import { useBoolean } from "@/hooks/use-boolean";
// components
import Iconify from "@/components/iconify";
import FormProvider, { RHFTextField } from "@/components/hook-form";

// ----------------------------------------------------------------------

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Email must be a valid email address"),
  password: Yup.string().required("Password is required"),
});

const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Email must be a valid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  phone: Yup.string().optional(),
});

type FormValuesProps = {
  name?: string;
  email: string;
  password: string;
  phone?: string;
};

export default function AuthView({ authType }: { authType: "login" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const returnTo = searchParams?.get("returnTo") || "/";
  const password = useBoolean();

  const schema = authType === "login" ? LoginSchema : SignupSchema;
  const defaultValues = {
    name: "",
    email: "",
    password: "",
    phone: "",
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      setErrorMsg("");

      if (authType === "signup") {
        // Handle signup
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Signup failed");
        }

        // After successful signup, sign in the user
        const signInResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.error) {
          throw new Error("Auto-login after signup failed");
        }

        router.push(returnTo);
      } else {
        // Handle login
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error("Invalid email or password");
        }

        router.push(returnTo);
      }
    } catch (error) {
      console.error("Auth error:", error);
      setErrorMsg(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  });

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setErrorMsg("");
      
      const result = await signIn("google", {
        callbackUrl: returnTo,
      });

      if (result?.error) {
        throw new Error("Google sign in failed");
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      setErrorMsg(error instanceof Error ? error.message : "Google sign in failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">
        {authType === "login" ? "Sign in to your account" : "Create your account"}
      </Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">
          {authType === "login" ? "New user?" : "Already have an account?"}
        </Typography>

        <MuiLink
          component={Link}
          href={authType === "login" ? paths.auth.signup : paths.auth.login}
          variant="subtitle2"
        >
          {authType === "login" ? "Create an account" : "Sign in"}
        </MuiLink>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {authType === "signup" && (
        <>
          <RHFTextField name="name" label="Full name" />
          <RHFTextField name="phone" label="Phone number (optional)" />
        </>
      )}

      <RHFTextField name="email" label="Email address" />

      <RHFTextField
        name="password"
        label="Password"
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

      {authType === "login" && (
        <MuiLink
          component={Link}
          href={paths.auth.forgotPassword}
          variant="body2"
          color="inherit"
          underline="always"
          sx={{ alignSelf: "flex-end" }}
        >
          Forgot password?
        </MuiLink>
      )}

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting || isLoading}
        loadingIndicator="Please wait..."
      >
        {authType === "login" ? "Sign In" : "Create Account"}
      </LoadingButton>
    </Stack>
  );

  const renderSocialAuth = (
    <Box>
      <Divider
        sx={{
          my: 2.5,
          typography: "overline",
          color: "text.disabled",
        }}
      >
        OR
      </Divider>

      <LoadingButton
        fullWidth
        variant="outlined"
        size="large"
        startIcon={<Iconify icon="logos:google-icon" />}
        onClick={handleGoogleSignIn}
        loading={isGoogleLoading}
        disabled={isGoogleLoading}
      >
        Continue with Google
      </LoadingButton>
    </Box>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      <Alert severity="info" sx={{ mb: 3 }}>
        Use email : <strong>demo@minimals.cc</strong> / password :<strong> demo1234</strong>
      </Alert>

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {renderForm}

      {renderSocialAuth}
    </FormProvider>
  );
}

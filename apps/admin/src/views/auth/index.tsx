"use client";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useState, Suspense } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import LoadingButton from "@mui/lab/LoadingButton";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
// routes
import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";
// config
// hooks
import { useBoolean } from "@/hooks/use-boolean";
// auth
import { signIn } from "next-auth/react";
// components
import Iconify from "@/components/iconify";
import FormProvider, { RHFTextField } from "@/components/hook-form";
import { useRouter, useSearchParams } from "next/navigation";

// ----------------------------------------------------------------------

function JwtLoginView() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    email: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setErrorMsg("");
    try {
      // Use NextAuth signIn for credentials
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        setErrorMsg(res.error || "Login failed. Please try again.");
        reset({ ...defaultValues, password: "" });
        return;
      }

      // Redirect to dashboard or returnTo param
      router.replace(returnTo || "/dashboard");
    } catch (error: any) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === "string" ? error : error.message);
    }
  });

  

  const renderForm = (
    <Stack spacing={3}>
      {!!errorMsg && (
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'error.main',
          }}
        >
          {errorMsg}
        </Alert>
      )}
      
      <RHFTextField 
        name="email" 
        label="Email address" 
        size="medium"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'background.paper',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            },
            '&.Mui-focused': {
              boxShadow: '0 2px 8px rgba(139, 69, 19, 0.2)',
            }
          }
        }}
      />
      
      <RHFTextField
        name="password"
        label="Password"
        size="medium"
        type={password.value ? "text" : "password"}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'background.paper',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            },
            '&.Mui-focused': {
              boxShadow: '0 2px 8px rgba(139, 69, 19, 0.2)',
            }
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton 
                onClick={password.onToggle} 
                edge="end"
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { 
                    color: 'primary.main',
                    backgroundColor: 'primary.lighter',
                  }
                }}
              >
                <Iconify
                  icon={password.value ? "solar:eye-bold" : "solar:eye-closed-bold"}
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      
      <Box display="flex" justifyContent="flex-end">
        <Link
          variant="body2"
          color="primary"
          underline="hover"
          sx={{ 
            fontWeight: 500,
            '&:hover': { 
              color: 'primary.dark',
              textDecoration: 'underline',
            }
          }}
        >
          Forgot password?
        </Link>
      </Box>
      
      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ 
          borderRadius: 2, 
          fontWeight: 600, 
          py: 1.75, 
          fontSize: 16,
          boxShadow: '0 4px 12px rgba(139, 69, 19, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(139, 69, 19, 0.4)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0px)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        Sign In to Furnerio
      </LoadingButton>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Box sx={{ mb: 3 }} />
      {renderForm}
    </FormProvider>
  );
}

export default function AuthView() {
  return (
    <Suspense>
      <JwtLoginView />
    </Suspense>
  );
}

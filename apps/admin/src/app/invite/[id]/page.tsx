"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Paper,
  Stack,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useSnackbar, Iconify } from "@storely/shared/components";
import { signIn } from "next-auth/react";
import { ROLE_LABEL_MAP } from "@/constants/role-label-map";

interface InvitationData {
  id: string;
  email: string;
  role: string;
  organization: {
    id: string;
    name: string;
  };
  invitedBy: {
    name: string;
    email: string;
  };
  expiresAt: string;
}

export default function InviteAcceptPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { enqueueSnackbar } = useSnackbar();
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inviteId = params.id as string;

  useEffect(() => {
    if (inviteId) {
      fetchInvitation();
    }
  }, [inviteId]);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (status === "authenticated" && session?.user) {
      enqueueSnackbar("You are already logged in", { variant: "info" });
      router.push("/dashboard");
    }
  }, [status, session, router, enqueueSnackbar]);

  const fetchInvitation = async () => {
    try {
      const response = await fetch(`/api/invitations/${inviteId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load invitation");
        return;
      }

      setInvitation(data.invitation);
    } catch (err) {
      setError("Failed to load invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!name.trim()) {
      enqueueSnackbar("Please enter your name", { variant: "error" });
      return;
    }

    if (password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", { variant: "error" });
      return;
    }

    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return;
    }

    setAccepting(true);
    try {
      const response = await fetch(`/api/invitations/${inviteId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        enqueueSnackbar(data.error || "Failed to accept invitation", { variant: "error" });
        return;
      }

      enqueueSnackbar("Account created successfully! Signing you in...", { variant: "success" });

      // Automatically sign in the user
      const signInResult = await signIn("credentials", {
        email: invitation?.email,
        password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push("/dashboard");
      } else {
        enqueueSnackbar("Account created but sign-in failed. Please sign in manually.", { variant: "warning" });
        router.push("/auth/login");
      }
    } catch (err) {
      enqueueSnackbar("Failed to accept invitation", { variant: "error" });
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography>Loading invitation...</Typography>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={() => router.push("/auth/login")}>
            Go to Login
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!invitation) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Invitation not found
          </Alert>
          <Button variant="contained" onClick={() => router.push("/auth/login")}>
            Go to Login
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" gutterBottom>
              Join {invitation.organization.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You&apos;ve been invited by {invitation.invitedBy.name} to join {invitation.organization.name} as a{" "}
              <strong>{ROLE_LABEL_MAP[invitation.role] || invitation.role}</strong>.
              Complete your account setup below.
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Email:</strong> {invitation.email}
            </Typography>
          </Alert>

          <Stack spacing={3}>
            <TextField
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              disabled={accepting}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              disabled={accepting}
              helperText="Password must be at least 6 characters"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      <Iconify icon={showPassword ? "solar:eye-bold" : "solar:eye-closed-bold"} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
              disabled={accepting}
              error={!!(confirmPassword && password !== confirmPassword)}
              helperText={confirmPassword && password !== confirmPassword ? "Passwords do not match" : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      <Iconify icon={showConfirmPassword ? "solar:eye-bold" : "solar:eye-closed-bold"} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleAcceptInvitation}
              disabled={accepting || !name.trim() || !password || !confirmPassword || password !== confirmPassword}
              startIcon={<Iconify icon="solar:user-check-bold" />}
              sx={{ mt: 2 }}
            >
              {accepting ? "Creating Account..." : "Accept Invitation & Create Account"}
            </Button>

            <Button
              variant="text"
              onClick={() => router.push("/auth/login")}
              disabled={accepting}
            >
              Already have an account? Sign in
            </Button>
          </Stack>

          <Box mt={3} textAlign="center">
            <Typography variant="caption" color="text.secondary">
              This invitation expires on {new Date(invitation.expiresAt).toLocaleDateString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

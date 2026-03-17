"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface FieldErrors {
  email?: string;
  password?: string;
}

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors]   = useState<FieldErrors>({});
  const [serverError, setServerError]   = useState("");
  const [loading, setLoading]           = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setServerError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.status === 422) {
        const errors: FieldErrors = {};
        for (const err of data.errors) {
          errors[err.field as keyof FieldErrors] = err.message;
        }
        setFieldErrors(errors);
        return;
      }

      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      localStorage.setItem("access_token", data.access_token);
      router.push("/dashboard");
    } catch {
      setServerError("Unable to reach the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 420,
        p: { xs: 3, sm: 5 },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      {/* Header */}
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Welcome back
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Sign in to your Trading Journal account
      </Typography>

      {serverError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {serverError}
        </Alert>
      )}

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!fieldErrors.email}
          helperText={fieldErrors.email}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!fieldErrors.password}
          helperText={fieldErrors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
          sx={{ fontWeight: 600 }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="body2" color="text.secondary" textAlign="center">
        Don&apos;t have an account?{" "}
        <Link href="/register" style={{ color: "inherit", fontWeight: 600 }}>
          Create one
        </Link>
      </Typography>
    </Paper>
  );
}

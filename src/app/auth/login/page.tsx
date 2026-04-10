"use client";
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/app/lib/api";
import { token } from "@/app/lib/token";

export default function Login() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await authApi.login({ email: form.email, password: form.password });
      token.set(data.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }}>
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
        <Typography variant="h5" fontWeight={700} gutterBottom>
            Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
            Sign in to your Trading Journal account
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                fullWidth
                required
                autoComplete="off"
                sx={{ mb: 2 }}
            />

            <TextField
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                autoComplete="new-password"
                slotProps={{
                    input: {
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
                    },
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
            <Link href="/auth/register" style={{ color: "inherit", fontWeight: 600 }}>
            Create one
            </Link>
        </Typography>
        </Paper>
    </Box>
  );
}
"use client";
import { useRef, useState } from "react";
import {
  Avatar,
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
import { Visibility, VisibilityOff, PhotoCamera } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { authApi } from "@/app/lib/api";
import { token } from "@/app/lib/token";

export default function Register() {
    const router = useRouter();

    const [showPassword, setShowPassword]   = useState(false);
    const [loading, setLoading]             = useState(false);
    const [error, setError]                 = useState<string | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile]       = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        bio: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await authApi.register({
                username: form.username,
                email: form.email,
                password: form.password,
                bio: form.bio || undefined,
            });

            if (avatarFile) {
                await authApi.uploadAvatar(avatarFile, data.access_token);
            }

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
                Create New Account
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4}>
                Sign Up to track all your trades
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate>

                {/* Avatar upload */}
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                    <Box sx={{ position: "relative" }}>
                        <Avatar
                            src={avatarPreview ?? undefined}
                            sx={{ width: 88, height: 88, bgcolor: "action.hover" }}
                        />
                        <IconButton
                            onClick={() => fileInputRef.current?.click()}
                            size="small"
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                bgcolor: "primary.main",
                                color: "primary.contrastText",
                                "&:hover": { bgcolor: "primary.dark" },
                            }}
                        >
                            <PhotoCamera fontSize="small" />
                        </IconButton>
                    </Box>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleAvatarChange}
                    />
                    <Typography variant="caption" color="text.secondary" mt={1}>
                        {avatarFile ? avatarFile.name : "Upload avatar (optional)"}
                    </Typography>
                </Box>

                <TextField
                    label="Username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    type="text"
                    fullWidth
                    required
                    autoComplete="off"
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    fullWidth
                    required
                    autoComplete="email"
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

                <TextField
                    label="Tell us who you are..."
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Tell us a bit about yourself..."
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
                {loading ? "Creating account…" : "Create account"}
                </Button>
            </Box>
            <Divider sx={{ my: 3 }} />
            </Paper>
        </Box>
    )
}

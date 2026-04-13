"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { strategyApi, Strategy } from "@/app/lib/api";
import { token } from "@/app/lib/token";

export default function StrategiesPage() {
    const router = useRouter();
    const [strategies, setStrategies] = useState<Strategy[]>([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState<string | null>(null);

    useEffect(() => {
        const accessToken = token.get();
        if (!accessToken) return;

        strategyApi
            .getAll(accessToken)
            .then(setStrategies)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <Box>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Typography variant="h6" fontWeight={700}>
                    Strategies
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => router.push("/dashboard/strategies/new")}
                    sx={{ borderRadius: 2 }}
                >
                    New strategy
                </Button>
            </Box>

            {/* Body */}
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", pt: 6 }}>
                    <CircularProgress size={28} />
                </Box>
            ) : error ? (
                <Box sx={{ p: 4, textAlign: "center" }}>
                    <Typography color="error">{error}</Typography>
                </Box>
            ) : strategies.length === 0 ? (
                <Box sx={{ p: 4, textAlign: "center" }}>
                    <Typography color="text.secondary">
                        No strategies yet. Create your first one.
                    </Typography>
                </Box>
            ) : (
                <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
                    {strategies.map((strategy, index) => (
                        <Box key={strategy.id} component="li">
                            <Box sx={{ px: 2, py: 1.5 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                                    <Typography fontWeight={600}>{strategy.name}</Typography>
                                    <Chip
                                        label={`${strategy.steps.length} ${strategy.steps.length === 1 ? "step" : "steps"}`}
                                        size="small"
                                        variant="outlined"
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(strategy.created_at).toLocaleDateString()}
                                </Typography>
                            </Box>
                            {index < strategies.length - 1 && <Divider />}
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}

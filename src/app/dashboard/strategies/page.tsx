"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    Tooltip,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { strategyApi, Strategy } from "@/app/lib/api";
import { token } from "@/app/lib/token";
import ConfirmModal from "@/app/ui/components/ConfirmModal";

export default function StrategiesPage() {
    const router = useRouter();
    const [strategies, setStrategies] = useState<Strategy[]>([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState<string | null>(null);

    const [pendingDelete, setPendingDelete] = useState<Strategy | null>(null);
    const [deleting, setDeleting]           = useState(false);

    useEffect(() => {
        const accessToken = token.get();
        if (!accessToken) return;

        strategyApi
            .getAll(accessToken)
            .then(setStrategies)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    async function handleConfirmDelete() {
        if (!pendingDelete) return;
        const accessToken = token.get();
        if (!accessToken) return;

        setDeleting(true);
        try {
            await strategyApi.delete(pendingDelete.id, accessToken);
            setStrategies((prev) => prev.filter((s) => s.id !== pendingDelete.id));
            setPendingDelete(null);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to delete strategy");
        } finally {
            setDeleting(false);
        }
    }

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
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Chip
                                            label={`${strategy.steps.length} ${strategy.steps.length === 1 ? "step" : "steps"}`}
                                            size="small"
                                            variant="outlined"
                                        />
                                        <Tooltip title="View strategy">
                                            <IconButton
                                                size="small"
                                                onClick={() => router.push(`/dashboard/strategies/${strategy.id}`)}
                                                sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}
                                            >
                                                <VisibilityOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit strategy">
                                            <IconButton
                                                size="small"
                                                onClick={() => router.push(`/dashboard/strategies/${strategy.id}/edit`)}
                                                sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
                                            >
                                                <EditOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete strategy">
                                            <IconButton
                                                size="small"
                                                onClick={() => setPendingDelete(strategy)}
                                                sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
                                            >
                                                <DeleteOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
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

            <ConfirmModal
                open={!!pendingDelete}
                title="Delete strategy"
                description={`Are you sure you want to delete "${pendingDelete?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                loading={deleting}
                onConfirm={handleConfirmDelete}
                onCancel={() => setPendingDelete(null)}
            />
        </Box>
    );
}

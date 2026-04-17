"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { strategyApi, Strategy } from "@/app/lib/api";
import { token } from "@/app/lib/token";

export default function ViewStrategyPage() {
    const router  = useRouter();
    const { id }  = useParams<{ id: string }>();
    const [strategy, setStrategy] = useState<Strategy | null>(null);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const accessToken = token.get();
        if (!accessToken) { router.replace("/auth/login"); return; }

        strategyApi
            .getOne(Number(id), accessToken)
            .then(setStrategy)
            .catch(() => router.replace("/dashboard/strategies"))
            .finally(() => setFetching(false));
    }, [id, router]);

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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton size="small" onClick={() => router.back()}>
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="h6" fontWeight={700}>
                        {strategy?.name ?? "Strategy"}
                    </Typography>
                    {strategy?.version && (
                        <Chip label={`v${strategy.version}`} size="small" variant="outlined" />
                    )}
                </Box>

                {strategy && (
                    <Tooltip title="Edit strategy">
                        <IconButton
                            size="small"
                            onClick={() => router.push(`/dashboard/strategies/${id}/edit`)}
                        >
                            <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {fetching ? (
                <Box sx={{ display: "flex", justifyContent: "center", pt: 6 }}>
                    <CircularProgress size={28} />
                </Box>
            ) : strategy && (
                <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 3 }}>

                    {/* Indicators */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            color="text.secondary"
                            sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                        >
                            Indicators
                        </Typography>

                        {strategy.indicators.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                No indicators defined.
                            </Typography>
                        ) : (
                            strategy.indicators.map((indicator, index) => (
                                <Box key={indicator.id}>
                                    <Box sx={{ py: 1 }}>
                                        <Typography fontWeight={600} gutterBottom>
                                            {indicator.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                                            {indicator.description}
                                        </Typography>
                                    </Box>
                                    {index < strategy.indicators.length - 1 && <Divider />}
                                </Box>
                            ))
                        )}
                    </Box>

                    <Divider />

                    {/* Checklists */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            color="text.secondary"
                            sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                        >
                            Checklist
                        </Typography>

                        {strategy.checklists.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                No checklist items defined.
                            </Typography>
                        ) : (
                            strategy.checklists.map((item, index) => (
                                <Box key={item.id}>
                                    <Box sx={{ py: 1 }}>
                                        <Typography fontWeight={600} gutterBottom>
                                            {item.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                                            {item.description}
                                        </Typography>
                                    </Box>
                                    {index < strategy.checklists.length - 1 && <Divider />}
                                </Box>
                            ))
                        )}
                    </Box>

                    <Divider />

                    {/* Steps */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            color="text.secondary"
                            sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                        >
                            Steps
                        </Typography>

                        {strategy.steps.map((step, index) => (
                            <Box key={step.id}>
                                <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", py: 1 }}>
                                    <Box
                                        sx={{
                                            mt: "2px",
                                            minWidth: 28,
                                            height: 28,
                                            borderRadius: "50%",
                                            bgcolor: "primary.main",
                                            color: "primary.contrastText",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 13,
                                            fontWeight: 700,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {step.position}
                                    </Box>
                                    <Box>
                                        {step.title && (
                                            <Typography fontWeight={600} gutterBottom>
                                                {step.title}
                                            </Typography>
                                        )}
                                        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                                            {step.content}
                                        </Typography>
                                    </Box>
                                </Box>
                                {index < strategy.steps.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </Box>

                    <Divider />

                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EditOutlinedIcon />}
                            onClick={() => router.push(`/dashboard/strategies/${id}/edit`)}
                            sx={{ borderRadius: 2 }}
                        >
                            Edit strategy
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

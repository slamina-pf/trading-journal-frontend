"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { strategyApi } from "@/app/lib/api";
import { token } from "@/app/lib/token";
import StrategyForm, { StrategyFormValues } from "../_components/StrategyForm";

export default function NewStrategyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(values: StrategyFormValues) {
        const accessToken = token.get();
        if (!accessToken) { router.replace("/auth/login"); return; }

        setLoading(true);
        try {
            await strategyApi.create(values, accessToken);
            router.push("/dashboard/strategies");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                <IconButton size="small" onClick={() => router.back()}>
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Typography variant="h6" fontWeight={700}>New strategy</Typography>
            </Box>

            <StrategyForm
                submitLabel="Save strategy"
                loading={loading}
                onSubmit={handleSubmit}
                onCancel={() => router.back()}
            />
        </Box>
    );
}

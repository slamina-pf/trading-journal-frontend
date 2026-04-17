"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { strategyApi, Strategy } from "@/app/lib/api";
import { token } from "@/app/lib/token";
import StrategyForm, { StrategyFormValues } from "../../_components/StrategyForm";

export default function EditStrategyPage() {
    const router              = useRouter();
    const { id }              = useParams<{ id: string }>();
    const [strategy, setStrategy] = useState<Strategy | null>(null);
    const [fetching, setFetching] = useState(true);
    const [loading, setLoading]   = useState(false);

    useEffect(() => {
        const accessToken = token.get();
        if (!accessToken) { router.replace("/auth/login"); return; }

        strategyApi
            .getOne(Number(id), accessToken)
            .then(setStrategy)
            .catch(() => router.replace("/dashboard/strategies"))
            .finally(() => setFetching(false));
    }, [id, router]);

    async function handleSubmit(values: StrategyFormValues) {
        const accessToken = token.get();
        if (!accessToken) { router.replace("/auth/login"); return; }

        setLoading(true);
        try {
            await strategyApi.update(Number(id), values, accessToken);
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
                <Typography variant="h6" fontWeight={700}>Edit strategy</Typography>
            </Box>

            {fetching ? (
                <Box sx={{ display: "flex", justifyContent: "center", pt: 6 }}>
                    <CircularProgress size={28} />
                </Box>
            ) : strategy ? (
                <StrategyForm
                    initialValues={{
                        name:       strategy.name,
                        indicators: strategy.indicators.map((i) => ({ name: i.name, description: i.description })),
                        checklists: strategy.checklists.map((c) => ({ name: c.name, description: c.description })),
                        steps:      strategy.steps.map((s) => ({ title: s.title, content: s.content })),
                    }}
                    submitLabel="Save changes"
                    loading={loading}
                    onSubmit={handleSubmit}
                    onCancel={() => router.back()}
                />
            ) : null}
        </Box>
    );
}

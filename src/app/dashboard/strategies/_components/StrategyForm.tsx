"use client";
import { useState } from "react";
import {
    Alert,
    Box,
    Button,
    Divider,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { CreateStrategyPayload } from "@/app/lib/api";

interface IndicatorDraft {
    key:         number;
    name:        string;
    description: string;
}

interface StepDraft {
    key:     number;
    title:   string;
    content: string;
}

export interface StrategyFormValues {
    name:       string;
    indicators: { name: string; description: string }[];
    steps:      { position: number; title?: string; content: string }[];
}

interface Props {
    initialValues?: {
        name:       string;
        indicators: { name: string; description: string }[];
        steps:      { title: string | null; content: string }[];
    };
    submitLabel: string;
    loading:     boolean;
    onSubmit:    (values: StrategyFormValues) => Promise<void>;
    onCancel:    () => void;
}

let _key = 0;
const nextKey = () => ++_key;

function makeIndicatorDrafts(indicators: { name: string; description: string }[]): IndicatorDraft[] {
    return indicators.map((i) => ({ key: nextKey(), name: i.name, description: i.description }));
}

function makeStepDrafts(steps: { title: string | null; content: string }[]): StepDraft[] {
    return steps.map((s) => ({ key: nextKey(), title: s.title ?? "", content: s.content }));
}

export default function StrategyForm({ initialValues, submitLabel, loading, onSubmit, onCancel }: Props) {
    const [name, setName]             = useState(initialValues?.name ?? "");
    const [indicators, setIndicators] = useState<IndicatorDraft[]>(
        initialValues ? makeIndicatorDrafts(initialValues.indicators) : []
    );
    const [steps, setSteps]           = useState<StepDraft[]>(
        initialValues ? makeStepDrafts(initialValues.steps) : [{ key: nextKey(), title: "", content: "" }]
    );
    const [error, setError]           = useState<string | null>(null);

    // ── Indicators ──────────────────────────────────────────────────────────
    const addIndicator = () =>
        setIndicators((prev) => [...prev, { key: nextKey(), name: "", description: "" }]);

    const removeIndicator = (key: number) =>
        setIndicators((prev) => prev.filter((i) => i.key !== key));

    const updateIndicator = (key: number, field: "name" | "description", value: string) =>
        setIndicators((prev) => prev.map((i) => (i.key === key ? { ...i, [field]: value } : i)));

    // ── Steps ────────────────────────────────────────────────────────────────
    const addStep = () =>
        setSteps((prev) => [...prev, { key: nextKey(), title: "", content: "" }]);

    const removeStep = (key: number) =>
        setSteps((prev) => prev.filter((s) => s.key !== key));

    const updateStep = (key: number, field: "title" | "content", value: string) =>
        setSteps((prev) => prev.map((s) => (s.key === key ? { ...s, [field]: value } : s)));

    // ── Submit ───────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        setError(null);

        if (!name.trim()) {
            setError("Strategy name is required.");
            return;
        }
        if (indicators.some((i) => !i.name.trim() || !i.description.trim())) {
            setError("Every indicator must have a name and a description.");
            return;
        }
        if (steps.some((s) => !s.content.trim())) {
            setError("Every step must have content.");
            return;
        }

        try {
            await onSubmit({
                name: name.trim(),
                indicators: indicators.map((i) => ({
                    name:        i.name.trim(),
                    description: i.description.trim(),
                })),
                steps: steps.map((s, idx) => ({
                    position: idx + 1,
                    title:    s.title.trim() || undefined,
                    content:  s.content.trim(),
                })),
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        }
    };

    return (
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 3 }}>
            {error && <Alert severity="error">{error}</Alert>}

            {/* Strategy name */}
            <TextField
                label="Strategy name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                size="small"
                inputProps={{ maxLength: 100 }}
            />

            <Divider />

            {/* Indicators */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Indicators
                </Typography>

                {indicators.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                        No indicators added yet.
                    </Typography>
                )}

                {indicators.map((indicator) => (
                    <Box key={indicator.key} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                            <TextField
                                placeholder="Indicator name"
                                value={indicator.name}
                                onChange={(e) => updateIndicator(indicator.key, "name", e.target.value)}
                                size="small"
                                fullWidth
                                inputProps={{ maxLength: 100 }}
                            />
                            <TextField
                                placeholder="How is this indicator configured?"
                                value={indicator.description}
                                onChange={(e) => updateIndicator(indicator.key, "description", e.target.value)}
                                size="small"
                                fullWidth
                                multiline
                                minRows={2}
                            />
                        </Box>
                        <IconButton size="small" onClick={() => removeIndicator(indicator.key)} sx={{ mt: "4px" }}>
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ))}

                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={addIndicator}
                    sx={{ alignSelf: "flex-start", borderRadius: 2 }}
                >
                    Add indicator
                </Button>
            </Box>

            <Divider />

            {/* Steps */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Steps
                </Typography>

                {steps.map((step, index) => (
                    <Box key={step.key} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                        <Box
                            sx={{
                                mt: "6px",
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
                            {index + 1}
                        </Box>

                        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                            <TextField
                                placeholder="Step title (optional)"
                                value={step.title}
                                onChange={(e) => updateStep(step.key, "title", e.target.value)}
                                size="small"
                                fullWidth
                                inputProps={{ maxLength: 100 }}
                            />
                            <TextField
                                placeholder="Describe this step…"
                                value={step.content}
                                onChange={(e) => updateStep(step.key, "content", e.target.value)}
                                size="small"
                                fullWidth
                                multiline
                                minRows={2}
                            />
                        </Box>

                        <IconButton
                            size="small"
                            onClick={() => removeStep(step.key)}
                            disabled={steps.length === 1}
                            sx={{ mt: "4px" }}
                        >
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ))}

                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={addStep}
                    sx={{ alignSelf: "flex-start", borderRadius: 2 }}
                >
                    Add step
                </Button>
            </Box>

            <Divider />

            {/* Actions */}
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Button variant="text" onClick={onCancel} disabled={loading} sx={{ borderRadius: 2 }}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSubmit} loading={loading} sx={{ borderRadius: 2 }}>
                    {submitLabel}
                </Button>
            </Box>
        </Box>
    );
}

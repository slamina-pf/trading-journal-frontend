"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Button,
    Divider,
    IconButton,
    TextField,
    Typography,
    Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { strategyApi } from "@/app/lib/api";
import { token } from "@/app/lib/token";

interface StepDraft {
    key:     number;
    title:   string;
    content: string;
}

let _key = 0;
const nextKey = () => ++_key;

export default function NewStrategyPage() {
    const router = useRouter();

    const [name, setName]     = useState("");
    const [steps, setSteps]   = useState<StepDraft[]>([{ key: nextKey(), title: "", content: "" }]);
    const [error, setError]   = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const addStep = () =>
        setSteps((prev) => [...prev, { key: nextKey(), title: "", content: "" }]);

    const removeStep = (key: number) =>
        setSteps((prev) => prev.filter((s) => s.key !== key));

    const updateStep = (key: number, field: "title" | "content", value: string) =>
        setSteps((prev) =>
            prev.map((s) => (s.key === key ? { ...s, [field]: value } : s))
        );

    const handleSubmit = async () => {
        setError(null);

        if (!name.trim()) {
            setError("Strategy name is required.");
            return;
        }

        const emptyContent = steps.some((s) => !s.content.trim());
        if (emptyContent) {
            setError("Every step must have content.");
            return;
        }

        const accessToken = token.get();
        if (!accessToken) {
            router.replace("/auth/login");
            return;
        }

        setLoading(true);
        try {
            await strategyApi.create(
                {
                    name: name.trim(),
                    steps: steps.map((s, i) => ({
                        position: i + 1,
                        title:    s.title.trim() || undefined,
                        content:  s.content.trim(),
                    })),
                },
                accessToken,
            );
            router.push("/dashboard/strategies");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <IconButton size="small" onClick={() => router.back()}>
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Typography variant="h6" fontWeight={700}>
                    New strategy
                </Typography>
            </Box>

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

                {/* Steps */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {steps.map((step, index) => (
                        <Box key={step.key} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                            {/* Position badge */}
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

                            {/* Step fields */}
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

                            {/* Delete */}
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
                </Box>

                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={addStep}
                    sx={{ alignSelf: "flex-start", borderRadius: 2 }}
                >
                    Add step
                </Button>

                <Divider />

                {/* Actions */}
                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                    <Button
                        variant="text"
                        onClick={() => router.back()}
                        disabled={loading}
                        sx={{ borderRadius: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        loading={loading}
                        sx={{ borderRadius: 2 }}
                    >
                        Save strategy
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

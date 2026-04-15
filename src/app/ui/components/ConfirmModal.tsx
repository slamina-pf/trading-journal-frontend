"use client";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

interface ConfirmModalProps {
    open:          boolean;
    title:         string;
    description:   string;
    confirmLabel?: string;
    cancelLabel?:  string;
    loading?:      boolean;
    onConfirm:     () => void;
    onCancel:      () => void;
}

export default function ConfirmModal({
    open,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel  = "Cancel",
    loading      = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    return (
        <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{description}</DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                <Button variant="outlined" onClick={onCancel} disabled={loading}>
                    {cancelLabel}
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading ? "Deleting…" : confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

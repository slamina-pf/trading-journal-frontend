import { Box, Typography } from "@mui/material";

export default function DashboardPage() {
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ pb: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                Feed
            </Typography>
        </Box>
    );
}

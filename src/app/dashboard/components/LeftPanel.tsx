"use client";
import { useRouter, usePathname } from "next/navigation";
import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
} from "@mui/material";
import {
    HomeRounded,
    BarChartRounded,
    ShowChartRounded,
    LogoutRounded,
} from "@mui/icons-material";
import { token } from "@/app/lib/token";

const NAV_ITEMS = [
    { label: "Feed",      icon: <HomeRounded />,      href: "/dashboard" },
    { label: "Trades",    icon: <ShowChartRounded />,  href: "/dashboard/trades" },
    { label: "Analytics", icon: <BarChartRounded />,   href: "/dashboard/analytics" },
];

export default function LeftPanel() {
    const router   = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        token.clear();
        router.push("/auth/login");
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ px: 1, py: 2 }}>
                Trading Journal
            </Typography>

            <List disablePadding sx={{ flex: 1 }}>
                {NAV_ITEMS.map(({ label, icon, href }) => (
                    <ListItemButton
                        key={href}
                        selected={pathname === href}
                        onClick={() => router.push(href)}
                        sx={{ borderRadius: 2, mb: 0.5 }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
                        <ListItemText primary={label} />
                    </ListItemButton>
                ))}
            </List>

            <Box sx={{ mt: "auto" }}>
                <Divider sx={{ my: 1 }} />
                <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <LogoutRounded />
                    </ListItemIcon>
                    <ListItemText primary="Log out" />
                </ListItemButton>
            </Box>
        </Box>
    );
}

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import { token } from "@/app/lib/token";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!token.get()) {
            router.replace("/auth/login");
        }
    }, []);

    if (!mounted) return null;

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "grid",
                gridTemplateColumns: "3fr 6fr 3fr",
                maxWidth: 1280,
                mx: "auto",
            }}
        >
            <Box
                component="aside"
                sx={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    borderRight: "1px solid",
                    borderColor: "divider",
                    overflowY: "auto",
                }}
            >
                <LeftPanel />
            </Box>

            <Box component="main" sx={{ borderRight: "1px solid", borderColor: "divider" }}>
                {children}
            </Box>

            <Box
                component="aside"
                sx={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    overflowY: "auto",
                }}
            >
                <RightPanel />
            </Box>
        </Box>
    );
}

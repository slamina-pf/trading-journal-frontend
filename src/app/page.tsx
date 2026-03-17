import { Box } from "@mui/material";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login — Trading Journal",
};

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <LoginForm />
    </Box>
  );
}

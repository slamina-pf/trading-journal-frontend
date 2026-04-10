
import tradingJournalImg from "./images/tradingjournal_v2.png";
import {
    Box,
    AppBar,
    Toolbar,
    Button,
    Grid,
    Typography
} from "@mui/material";

export default function HomePage() {
  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ ml: 'auto', gap: 2 }} >
          <Button color="inherit" href="/auth/login">Sign In</Button>
          <Button color="inherit" href="/auth/register">Sign Up</Button>
        </Toolbar>
      </AppBar>
    </Box>
    <Box
      component="section"
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        minHeight: "calc(100vh - 64px)",
      }}
    >
      {/* Left — text */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 4, md: 8 },
          py: 6,
        }}
      >
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Track every trade.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your trading journal to log, review, and improve your performance over time.
        </Typography>
      </Box>

      {/* Right — image */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.paper",
        }}
      >
        <Box
          component="img"
          src={tradingJournalImg.src}
          alt="Trading dashboard preview"
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>
    </Box>
    </>
  );
}
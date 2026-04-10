import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  defaultColorScheme: "dark",
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: "#6366f1",
        },
        secondary: {
          main: "#22d3ee",
        },
        background: {
          default: "#0a0a0a",
          paper: "#141414",
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
});

export default theme;

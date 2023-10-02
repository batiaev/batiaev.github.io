import { createTheme } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";

export const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f9f4f9",
        },
      },
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: deepPurple[600],
    },
    secondary: {
      main: "#19857b",
    },
  },
});
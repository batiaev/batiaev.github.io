import { createTheme } from '@mui/material/styles';
import {deepPurple} from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main:  deepPurple[600],
    },
    secondary: {
      main: '#19857b',
    }
  },
});

export default theme;
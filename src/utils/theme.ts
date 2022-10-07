import { createTheme } from '@mui/material/styles';
import { green, blue, red, teal } from '@mui/material/colors';

export const theme = createTheme({
    palette: {
        primary: {
            main: teal[500],
        },
        secondary: {
            main: green[500],
        },
        error: {
            main: red[700],
        }
    },
});

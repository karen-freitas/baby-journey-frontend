import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#B095CC',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#B095CC',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#9A84B8',
          },
        },
      },
    },
  },
});

export default theme;
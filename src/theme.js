import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#B095CC', // Cor semelhante ao D4B7FF, mas mais escura
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#B095CC', // Cor padrão dos botões
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#9A84B8', // Cor ao passar o mouse (ainda mais escura)
          },
        },
      },
    },
  },
});

export default theme;
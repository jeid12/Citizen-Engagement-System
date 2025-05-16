import { createTheme } from '@mui/material/styles';

// Rwanda flag colors
const rwandaColors = {
  blue: '#00A0DC',    // Bright blue from flag
  yellow: '#FAD201',  // Yellow from flag
  green: '#20603D',   // Green from flag
  sun: '#E5B800',     // Sun color (darker yellow)
  // Additional supporting colors
  lightBlue: '#E3F2FD',
  lightGreen: '#E8F5E9',
  darkBlue: '#006C9C',
  white: '#FFFFFF',
  black: '#000000',
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
  }
};

const theme = createTheme({
  palette: {
    primary: {
      main: rwandaColors.blue,
      light: rwandaColors.lightBlue,
      dark: rwandaColors.darkBlue,
      contrastText: rwandaColors.white,
    },
    secondary: {
      main: rwandaColors.green,
      light: rwandaColors.lightGreen,
      dark: rwandaColors.green,
      contrastText: rwandaColors.white,
    },
    warning: {
      main: rwandaColors.yellow,
      light: rwandaColors.sun,
      dark: rwandaColors.sun,
      contrastText: rwandaColors.black,
    },
    background: {
      default: rwandaColors.grey[50],
      paper: rwandaColors.white,
    },
    text: {
      primary: rwandaColors.black,
      secondary: rwandaColors.grey[500],
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: rwandaColors.blue,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: rwandaColors.green,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          padding: '8px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: rwandaColors.blue,
        },
      },
    },
  },
});

export default theme; 
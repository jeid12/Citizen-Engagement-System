import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import store from './store';
import theme from './theme';
import AppRoutes from './routes';
import './i18n/i18n';  // Import i18n configuration

function App() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </Suspense>
  );
}

export default App; 
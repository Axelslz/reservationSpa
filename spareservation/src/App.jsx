import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

const theme = createTheme({
  palette: {
    primary: { main: '#7b1fa2' }, // Un morado elegante para el Spa
    secondary: { main: '#f48fb1' }, // Rosa para Nails
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
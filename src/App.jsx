import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import DashboardHome from './pages/DashboardHome';
import GanadoPage from './pages/GanadoPage';
import SaludGanadoPage from './pages/SaludGanadoPage';
import ProduccionLechePage from './pages/ProduccionLechePage';
import InventariosPage from './pages/InventariosPage';
import CategoriasInventarioPage from './pages/CategoriasInventarioPage';
import EmpleadosPage from './pages/EmpleadosPage';
import VentasPage from './pages/VentasPage';
import AlertasPage from './pages/AlertasPage';
import { theme as customTheme } from './theme';

// Crear tema de Material UI con los colores personalizados
const theme = createTheme({
  palette: customTheme,
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="ganado" element={<GanadoPage />} />
              <Route path="salud" element={<SaludGanadoPage />} />
              <Route path="produccion" element={<ProduccionLechePage />} />
              <Route path="inventarios" element={<InventariosPage />} />
              <Route path="categorias" element={<CategoriasInventarioPage />} />
              <Route path="empleados" element={<EmpleadosPage />} />
              <Route path="ventas" element={<VentasPage />} />
              <Route path="alertas" element={<AlertasPage />} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

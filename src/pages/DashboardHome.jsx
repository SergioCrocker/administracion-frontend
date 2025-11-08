import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  Pets,
  LocalHospital,
  Opacity,
  Inventory,
  TrendingUp,
  People,
  PointOfSale,
  Notifications,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const StatCard = ({ title, value, icon, color }) => (
  <Card
    elevation={3}
    sx={{
      height: '100%',
      background: `linear-gradient(135deg, ${color}dd 0%, ${color} 100%)`,
      color: 'white',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
      },
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {title}
          </Typography>
        </Box>
        <Avatar
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.3)',
            width: 60,
            height: 60,
          }}
        >
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const DashboardHome = () => {
  const { user } = useAuth();

  const stats = [
    { title: 'Total Ganado', value: '0', icon: <Pets fontSize="large" />, color: '#6B4423' },
    { title: 'Salud Registros', value: '0', icon: <LocalHospital fontSize="large" />, color: '#7CB342' },
    { title: 'Producción Leche (L)', value: '0', icon: <Opacity fontSize="large" />, color: '#42A5F5' },
    { title: 'Inventarios', value: '0', icon: <Inventory fontSize="large" />, color: '#FFA726' },
    { title: 'Empleados', value: '0', icon: <People fontSize="large" />, color: '#AB47BC' },
    { title: 'Ventas', value: '0', icon: <PointOfSale fontSize="large" />, color: '#66BB6A' },
    { title: 'Alertas Activas', value: '0', icon: <Notifications fontSize="large" />, color: '#EF5350' },
    { title: 'Productividad', value: '0%', icon: <TrendingUp fontSize="large" />, color: '#26A69A' },
  ];

  return (
    <Box>
      {/* Encabezado de bienvenida */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          background: 'linear-gradient(135deg, #6B4423 0%, #7CB342 100%)',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          ¡Bienvenido, {user?.nombre}! 🐄
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Sistema de Administración Ganadera - Panel de Control
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
          Rol: {user?.rol_nombre} | Último acceso: {new Date().toLocaleDateString('es-ES')}
        </Typography>
      </Paper>

      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Sección de información adicional */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#6B4423', fontWeight: 600 }}>
              📊 Resumen del Sistema
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              El sistema de administración ganadera permite gestionar de manera integral
              todos los aspectos de tu finca ganadera:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li><Typography variant="body2">Control de ganado y registros individuales</Typography></li>
              <li><Typography variant="body2">Seguimiento de salud y tratamientos veterinarios</Typography></li>
              <li><Typography variant="body2">Registro de producción de leche</Typography></li>
              <li><Typography variant="body2">Gestión de inventarios y suministros</Typography></li>
              <li><Typography variant="body2">Control de empleados y personal</Typography></li>
              <li><Typography variant="body2">Sistema de ventas y facturación</Typography></li>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#7CB342', fontWeight: 600 }}>
              🚀 Acciones Rápidas
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Accede rápidamente a las funciones más utilizadas:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Pets sx={{ color: '#6B4423' }} />
                <Typography variant="body2">Registrar nuevo ganado</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Opacity sx={{ color: '#42A5F5' }} />
                <Typography variant="body2">Registrar producción diaria</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalHospital sx={{ color: '#7CB342' }} />
                <Typography variant="body2">Registrar tratamiento médico</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Notifications sx={{ color: '#EF5350' }} />
                <Typography variant="body2">Ver alertas pendientes</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;

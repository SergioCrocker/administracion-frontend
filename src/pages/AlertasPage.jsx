import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Chip,
} from '@mui/material';
import { Add, Edit, Delete, Notifications, Warning, Info, Error as ErrorIcon } from '@mui/icons-material';
import { alertasService } from '../services/apiServices';

const AlertasPage = () => {
  const [alertas, setAlertas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    tipo_alerta: '',
    mensaje: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchAlertas();
  }, []);

  const fetchAlertas = async () => {
    try {
      const response = await alertasService.getAll();
      if (response.success) {
        setAlertas(response.data);
      }
    } catch (error) {
      showSnackbar('Error al cargar alertas', 'error');
    }
  };

  const handleOpenDialog = (alerta = null) => {
    if (alerta) {
      setEditingId(alerta.id);
      setFormData({
        tipo_alerta: alerta.tipo_alerta || '',
        mensaje: alerta.mensaje || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        tipo_alerta: '',
        mensaje: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await alertasService.update(editingId, formData);
        showSnackbar('Alerta actualizada exitosamente', 'success');
      } else {
        await alertasService.create(formData);
        showSnackbar('Alerta creada exitosamente', 'success');
      }
      handleCloseDialog();
      fetchAlertas();
    } catch (error) {
      console.error('Error al guardar alerta:', error);
      showSnackbar(error.response?.data?.message || 'Error al guardar alerta', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta alerta?')) {
      try {
        await alertasService.delete(id);
        showSnackbar('Alerta eliminada exitosamente', 'success');
        fetchAlertas();
      } catch (error) {
        showSnackbar('Error al eliminar alerta', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getAlertIcon = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'crítica':
      case 'critica':
      case 'error':
        return <ErrorIcon />;
      case 'advertencia':
      case 'warning':
        return <Warning />;
      case 'información':
      case 'informacion':
      case 'info':
        return <Info />;
      default:
        return <Notifications />;
    }
  };

  const getAlertColor = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'crítica':
      case 'critica':
      case 'error':
        return 'error';
      case 'advertencia':
      case 'warning':
        return 'warning';
      case 'información':
      case 'informacion':
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#EF5350', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Notifications sx={{ fontSize: 40 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Alertas
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: '#D32F2F',
              '&:hover': { backgroundColor: '#B71C1C' },
            }}
          >
            Nueva Alerta
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#F5F2ED' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Mensaje</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alertas.map((alerta) => (
              <TableRow key={alerta.id} hover>
                <TableCell>{alerta.id}</TableCell>
                <TableCell>
                  <Chip
                    icon={getAlertIcon(alerta.tipo_alerta)}
                    label={alerta.tipo_alerta || 'N/A'}
                    color={getAlertColor(alerta.tipo_alerta)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{alerta.mensaje || 'N/A'}</TableCell>
                <TableCell>{alerta.fecha_alerta || 'N/A'}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(alerta)}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(alerta.id)}
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#EF5350', color: 'white' }}>
          {editingId ? 'Editar Alerta' : 'Nueva Alerta'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Tipo de Alerta</InputLabel>
                <Select
                  name="tipo_alerta"
                  value={formData.tipo_alerta}
                  onChange={handleChange}
                  label="Tipo de Alerta"
                  required
                >
                  <MenuItem value="Información">Información</MenuItem>
                  <MenuItem value="Advertencia">Advertencia</MenuItem>
                  <MenuItem value="Crítica">Crítica</MenuItem>
                  <MenuItem value="Salud">Salud</MenuItem>
                  <MenuItem value="Inventario">Inventario</MenuItem>
                  <MenuItem value="Producción">Producción</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                required
                margin="normal"
                multiline
                rows={4}
                placeholder="Describa la alerta..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: '#EF5350',
              '&:hover': { backgroundColor: '#D32F2F' },
            }}
          >
            {editingId ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AlertasPage;

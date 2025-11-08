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
import { Add, Edit, Delete, Opacity } from '@mui/icons-material';
import { produccionLecheService, ganadoService } from '../services/apiServices';

const ProduccionLechePage = () => {
  const [registros, setRegistros] = useState([]);
  const [ganados, setGanados] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    ganado_id: '',
    cantidad_leche: '',
    calidad_leche: '',
    fecha_oreno: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchRegistros();
    fetchGanados();
  }, []);

  const fetchRegistros = async () => {
    try {
      const response = await produccionLecheService.getAll();
      if (response.success) {
        setRegistros(response.data);
      }
    } catch (error) {
      showSnackbar('Error al cargar registros', 'error');
    }
  };

  const fetchGanados = async () => {
    try {
      const response = await ganadoService.getAll();
      console.log('Ganados obtenidos:', response);
      if (response.success) {
        // Mostrar todo el ganado disponible
        setGanados(response.data);
        console.log('Ganados cargados:', response.data);
      }
    } catch (error) {
      console.error('Error al cargar ganado:', error);
      showSnackbar('Error al cargar ganado', 'error');
    }
  };

  const handleOpenDialog = (registro = null) => {
    if (registro) {
      setEditingId(registro.id);
      const fechaOreno = registro.fecha_oreno 
        ? new Date(registro.fecha_oreno).toISOString().slice(0, 16) 
        : '';
      setFormData({
        ganado_id: registro.ganado_id || '',
        cantidad_leche: registro.cantidad_leche || '',
        calidad_leche: registro.calidad_leche || '',
        fecha_oreno: fechaOreno,
      });
    } else {
      setEditingId(null);
      setFormData({
        ganado_id: '',
        cantidad_leche: '',
        calidad_leche: '',
        fecha_oreno: '',
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
        await produccionLecheService.update(editingId, formData);
        showSnackbar('Registro actualizado exitosamente', 'success');
      } else {
        await produccionLecheService.create(formData);
        showSnackbar('Registro creado exitosamente', 'success');
      }
      handleCloseDialog();
      fetchRegistros();
    } catch (error) {
      console.error('Error al guardar registro:', error);
      showSnackbar(error.response?.data?.message || 'Error al guardar registro', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este registro?')) {
      try {
        await produccionLecheService.delete(id);
        showSnackbar('Registro eliminado exitosamente', 'success');
        fetchRegistros();
      } catch (error) {
        showSnackbar('Error al eliminar registro', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getCalidadColor = (calidad) => {
    if (!calidad) return 'default';
    const valor = parseFloat(calidad);
    if (valor >= 80) return 'success';
    if (valor >= 60) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#42A5F5', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Opacity sx={{ fontSize: 40 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Producción de Leche
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: '#1976D2',
              '&:hover': { backgroundColor: '#1565C0' },
            }}
          >
            Registrar Producción
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#F5F2ED' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Ganado</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Cantidad (L)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Calidad</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Fecha Ordeño</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registros.map((registro) => (
              <TableRow key={registro.id} hover>
                <TableCell>{registro.id}</TableCell>
                <TableCell>
                  {registro.ganado_nombre || registro.ganado_rfid || 'N/A'}
                  {registro.ganado_rfid && ` (${registro.ganado_rfid})`}
                </TableCell>
                <TableCell>{registro.cantidad_leche || 'N/A'} L</TableCell>
                <TableCell>
                  <Chip
                    label={registro.calidad_leche ? `Calidad ${registro.calidad_leche}` : 'N/A'}
                    color={getCalidadColor(registro.calidad_leche)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{registro.fecha_oreno || registro.fecha_formatted || 'N/A'}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(registro)}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(registro.id)}
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
        <DialogTitle sx={{ backgroundColor: '#42A5F5', color: 'white' }}>
          {editingId ? 'Editar Producción' : 'Registrar Producción'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Ganado</InputLabel>
                <Select
                  name="ganado_id"
                  value={formData.ganado_id}
                  onChange={handleChange}
                  label="Ganado"
                  required
                >
                  {ganados.map((ganado) => (
                    <MenuItem key={ganado.id} value={ganado.id}>
                      {ganado.rfid} - {ganado.nombre || 'Sin nombre'} ({ganado.raza || 'Sin raza'})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cantidad (Litros)"
                name="cantidad_leche"
                type="number"
                value={formData.cantidad_leche}
                onChange={handleChange}
                required
                margin="normal"
                inputProps={{ step: '0.1', min: '0' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Calidad (Numérica)"
                name="calidad_leche"
                type="number"
                value={formData.calidad_leche}
                onChange={handleChange}
                required
                margin="normal"
                inputProps={{ step: '0.01', min: '0', max: '100' }}
                helperText="Calidad de la leche (0-100)"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Fecha y Hora del Ordeño"
                name="fecha_oreno"
                type="datetime-local"
                value={formData.fecha_oreno}
                onChange={handleChange}
                required
                margin="normal"
                InputLabelProps={{ shrink: true }}
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
              backgroundColor: '#42A5F5',
              '&:hover': { backgroundColor: '#1976D2' },
            }}
          >
            {editingId ? 'Actualizar' : 'Registrar'}
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

export default ProduccionLechePage;

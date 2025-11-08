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
} from '@mui/material';
import { Add, Edit, Delete, LocalHospital } from '@mui/icons-material';
import { saludGanadoService, ganadoService } from '../services/apiServices';

const SaludGanadoPage = () => {
  const [registros, setRegistros] = useState([]);
  const [ganados, setGanados] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    ganado_id: '',
    temperatura: '',
    comportamiento: '',
    observaciones: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchRegistros();
    fetchGanados();
  }, []);

  const fetchRegistros = async () => {
    try {
      const response = await saludGanadoService.getAll();
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
      if (response.success) {
        setGanados(response.data);
      }
    } catch (error) {
      console.error('Error al cargar ganado');
    }
  };

  const handleOpenDialog = (registro = null) => {
    if (registro) {
      setEditingId(registro.id);
      setFormData({
        ganado_id: registro.ganado_id || '',
        temperatura: registro.temperatura || '',
        comportamiento: registro.comportamiento || '',
        observaciones: registro.observaciones || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        ganado_id: '',
        temperatura: '',
        comportamiento: '',
        observaciones: '',
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
        await saludGanadoService.update(editingId, formData);
        showSnackbar('Registro actualizado exitosamente', 'success');
      } else {
        await saludGanadoService.create(formData);
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
        await saludGanadoService.delete(id);
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

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#7CB342', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LocalHospital sx={{ fontSize: 40 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Salud del Ganado
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: '#558B2F',
              '&:hover': { backgroundColor: '#33691E' },
            }}
          >
            Nuevo Registro
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#F5F2ED' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Ganado</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Temperatura (°C)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Comportamiento</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Observaciones</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Fecha Registro</TableCell>
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
                <TableCell>{registro.temperatura || 'N/A'}</TableCell>
                <TableCell>{registro.comportamiento || 'N/A'}</TableCell>
                <TableCell>{registro.observaciones || 'N/A'}</TableCell>
                <TableCell>{registro.fecha_registro || 'N/A'}</TableCell>
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
        <DialogTitle sx={{ backgroundColor: '#7CB342', color: 'white' }}>
          {editingId ? 'Editar Registro de Salud' : 'Nuevo Registro de Salud'}
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
                label="Temperatura (°C)"
                name="temperatura"
                type="number"
                value={formData.temperatura}
                onChange={handleChange}
                margin="normal"
                placeholder="Ej: 38.5"
                inputProps={{ step: '0.1', min: '0', max: '50' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Comportamiento"
                name="comportamiento"
                value={formData.comportamiento}
                onChange={handleChange}
                margin="normal"
                placeholder="Ej: Normal, Agresivo, Apático"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                multiline
                rows={4}
                margin="normal"
                placeholder="Ingrese detalles adicionales sobre el estado de salud del animal"
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
              backgroundColor: '#7CB342',
              '&:hover': { backgroundColor: '#558B2F' },
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

export default SaludGanadoPage;

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
import { Add, Edit, Delete, People } from '@mui/icons-material';
import { empleadosService } from '../services/apiServices';

const EmpleadosPage = () => {
  const [empleados, setEmpleados] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre_empleado: '',
    puesto: '',
    fecha_nacimiento: '',
    telefono: '',
    correo: '',
    estado: 'Activo',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const response = await empleadosService.getAll();
      if (response.success) {
        setEmpleados(response.data);
      }
    } catch (error) {
      showSnackbar('Error al cargar empleados', 'error');
    }
  };

  const handleOpenDialog = (empleado = null) => {
    if (empleado) {
      setEditingId(empleado.id);
      const fechaNacimiento = empleado.fecha_nacimiento 
        ? empleado.fecha_nacimiento.split('/').reverse().join('-') 
        : '';
      setFormData({
        nombre_empleado: empleado.nombre_empleado || '',
        puesto: empleado.puesto || '',
        fecha_nacimiento: fechaNacimiento,
        telefono: empleado.telefono || '',
        correo: empleado.correo || '',
        estado: empleado.estado || 'Activo',
      });
    } else {
      setEditingId(null);
      setFormData({
        nombre_empleado: '',
        puesto: '',
        fecha_nacimiento: '',
        telefono: '',
        correo: '',
        estado: 'Activo',
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
      const dataToSend = {
        ...formData,
        fecha_nacimiento: formData.fecha_nacimiento 
          ? formData.fecha_nacimiento.split('-').reverse().join('/')
          : null
      };

      if (editingId) {
        await empleadosService.update(editingId, dataToSend);
        showSnackbar('Empleado actualizado exitosamente', 'success');
      } else {
        await empleadosService.create(dataToSend);
        showSnackbar('Empleado creado exitosamente', 'success');
      }
      handleCloseDialog();
      fetchEmpleados();
    } catch (error) {
      console.error('Error al guardar empleado:', error);
      showSnackbar(error.response?.data?.message || 'Error al guardar empleado', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este empleado?')) {
      try {
        await empleadosService.delete(id);
        showSnackbar('Empleado eliminado exitosamente', 'success');
        fetchEmpleados();
      } catch (error) {
        showSnackbar('Error al eliminar empleado', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#AB47BC', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <People sx={{ fontSize: 40 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Empleados
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: '#8E24AA',
              '&:hover': { backgroundColor: '#6A1B9A' },
            }}
          >
            Nuevo Empleado
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#F5F2ED' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Puesto</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Teléfono</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Correo</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Fecha Ingreso</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {empleados.map((empleado) => (
              <TableRow key={empleado.id} hover>
                <TableCell>{empleado.id}</TableCell>
                <TableCell>{empleado.nombre_empleado || 'N/A'}</TableCell>
                <TableCell>{empleado.puesto || 'N/A'}</TableCell>
                <TableCell>{empleado.telefono || 'N/A'}</TableCell>
                <TableCell>{empleado.correo || 'N/A'}</TableCell>
                <TableCell>{empleado.fecha_ingreso || 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={empleado.estado || 'Activo'}
                    color={empleado.estado === 'Activo' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(empleado)}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(empleado.id)}
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
        <DialogTitle sx={{ backgroundColor: '#AB47BC', color: 'white' }}>
          {editingId ? 'Editar Empleado' : 'Nuevo Empleado'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre Completo"
                name="nombre_empleado"
                value={formData.nombre_empleado}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Puesto"
                name="puesto"
                value={formData.puesto}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha de Nacimiento"
                name="fecha_nacimiento"
                type="date"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="correo"
                type="email"
                value={formData.correo}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Estado</InputLabel>
                <Select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  label="Estado"
                >
                  <MenuItem value="Activo">Activo</MenuItem>
                  <MenuItem value="Inactivo">Inactivo</MenuItem>
                  <MenuItem value="Vacaciones">Vacaciones</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: '#AB47BC',
              '&:hover': { backgroundColor: '#8E24AA' },
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

export default EmpleadosPage;

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
  Chip,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import { Add, Edit, Delete, Pets } from '@mui/icons-material';
import { ganadoService } from '../services/apiServices';

const GanadoPage = () => {
  const [ganados, setGanados] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    rfid: '',
    nombre: '',
    raza: '',
    fecha_nacimiento: '',
    estado: 'Activo',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchGanados();
  }, []);

  const fetchGanados = async () => {
    try {
      const response = await ganadoService.getAll();
      if (response.success) {
        setGanados(response.data);
      }
    } catch (error) {
      showSnackbar('Error al cargar ganado', 'error');
    }
  };

  const handleOpenDialog = (ganado = null) => {
    if (ganado) {
      setEditingId(ganado.id);
      // Convertir fecha al formato yyyy-MM-dd para el input date
      const fechaNacimiento = ganado.fecha_nacimiento ? ganado.fecha_nacimiento.split('/').reverse().join('-') : '';
      setFormData({
        rfid: ganado.rfid || '',
        nombre: ganado.nombre || '',
        raza: ganado.raza || '',
        fecha_nacimiento: fechaNacimiento,
        estado: ganado.estado || 'Activo',
      });
    } else {
      setEditingId(null);
      setFormData({
        rfid: '',
        nombre: '',
        raza: '',
        fecha_nacimiento: '',
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
      // Convertir fecha de yyyy-MM-dd a DD/MM/YYYY para el backend
      const dataToSend = {
        ...formData,
        fecha_nacimiento: formData.fecha_nacimiento 
          ? formData.fecha_nacimiento.split('-').reverse().join('/')
          : null
      };
      
      if (editingId) {
        await ganadoService.update(editingId, dataToSend);
        showSnackbar('Ganado actualizado exitosamente', 'success');
      } else {
        await ganadoService.create(dataToSend);
        showSnackbar('Ganado creado exitosamente', 'success');
      }
      handleCloseDialog();
      fetchGanados();
    } catch (error) {
      console.error('Error al guardar ganado:', error);
      showSnackbar(error.response?.data?.message || 'Error al guardar ganado', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este registro?')) {
      try {
        await ganadoService.delete(id);
        showSnackbar('Ganado eliminado exitosamente', 'success');
        fetchGanados();
      } catch (error) {
        showSnackbar('Error al eliminar ganado', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#6B4423', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Pets sx={{ fontSize: 40 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Gestión de Ganado
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: '#7CB342',
              '&:hover': { backgroundColor: '#558B2F' },
            }}
          >
            Nuevo Ganado
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#F5F2ED' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>RFID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Raza</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Fecha Nacimiento</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ganados.map((ganado) => (
              <TableRow key={ganado.id} hover>
                <TableCell>{ganado.id}</TableCell>
                <TableCell>{ganado.rfid}</TableCell>
                <TableCell>{ganado.nombre || 'N/A'}</TableCell>
                <TableCell>{ganado.raza || 'N/A'}</TableCell>
                <TableCell>{ganado.fecha_nacimiento || 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={ganado.estado || 'Activo'}
                    color={ganado.estado === 'Activo' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(ganado)}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(ganado.id)}
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

      {/* Dialog para crear/editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#6B4423', color: 'white' }}>
          {editingId ? 'Editar Ganado' : 'Nuevo Ganado'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="RFID"
                name="rfid"
                value={formData.rfid}
                onChange={handleChange}
                required
                margin="normal"
                helperText="Identificación única del animal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Raza"
                name="raza"
                value={formData.raza}
                onChange={handleChange}
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
                  <MenuItem value="Vendido">Vendido</MenuItem>
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
              backgroundColor: '#6B4423',
              '&:hover': { backgroundColor: '#4A2F18' },
            }}
          >
            {editingId ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
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

export default GanadoPage;

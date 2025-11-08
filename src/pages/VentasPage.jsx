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
  Grid,
} from '@mui/material';
import { Add, Edit, Delete, PointOfSale } from '@mui/icons-material';
import { ventasService } from '../services/apiServices';

const VentasPage = () => {
  const [ventas, setVentas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    producto: '',
    cantidad: '',
    precio_unitario: '',
    cliente_nombre: '',
    cliente_direccion: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    try {
      const response = await ventasService.getAll();
      if (response.success) {
        setVentas(response.data);
      }
    } catch (error) {
      showSnackbar('Error al cargar ventas', 'error');
    }
  };

  const handleOpenDialog = (venta = null) => {
    if (venta) {
      setEditingId(venta.id);
      setFormData({
        producto: venta.producto || '',
        cantidad: venta.cantidad || '',
        precio_unitario: venta.precio_unitario || '',
        cliente_nombre: venta.cliente_nombre || '',
        cliente_direccion: venta.cliente_direccion || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        producto: '',
        cantidad: '',
        precio_unitario: '',
        cliente_nombre: '',
        cliente_direccion: '',
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
        await ventasService.update(editingId, formData);
        showSnackbar('Venta actualizada exitosamente', 'success');
      } else {
        await ventasService.create(formData);
        showSnackbar('Venta registrada exitosamente', 'success');
      }
      handleCloseDialog();
      fetchVentas();
    } catch (error) {
      console.error('Error al guardar venta:', error);
      showSnackbar(error.response?.data?.message || 'Error al guardar venta', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta venta?')) {
      try {
        await ventasService.delete(id);
        showSnackbar('Venta eliminada exitosamente', 'success');
        fetchVentas();
      } catch (error) {
        showSnackbar('Error al eliminar venta', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const calcularTotal = (cantidad, precioUnitario) => {
    return (parseFloat(cantidad) * parseFloat(precioUnitario)).toFixed(2);
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#66BB6A', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PointOfSale sx={{ fontSize: 40 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Ventas
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: '#4CAF50',
              '&:hover': { backgroundColor: '#388E3C' },
            }}
          >
            Nueva Venta
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#F5F2ED' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Producto</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Cantidad</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Precio Unit.</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ventas.map((venta) => (
              <TableRow key={venta.id} hover>
                <TableCell>{venta.id}</TableCell>
                <TableCell>{venta.producto || 'N/A'}</TableCell>
                <TableCell>{venta.cantidad || 0}</TableCell>
                <TableCell>Q{venta.precio_unitario || '0.00'}</TableCell>
                <TableCell>
                  <strong>Q{calcularTotal(venta.cantidad || 0, venta.precio_unitario || 0)}</strong>
                </TableCell>
                <TableCell>{venta.cliente_nombre || 'N/A'}</TableCell>
                <TableCell>{venta.fecha_venta || 'N/A'}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(venta)}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(venta.id)}
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
        <DialogTitle sx={{ backgroundColor: '#66BB6A', color: 'white' }}>
          {editingId ? 'Editar Venta' : 'Nueva Venta'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Producto"
                name="producto"
                value={formData.producto}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cantidad"
                name="cantidad"
                type="number"
                value={formData.cantidad}
                onChange={handleChange}
                required
                margin="normal"
                inputProps={{ step: '0.01', min: '0' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Precio Unitario"
                name="precio_unitario"
                type="number"
                value={formData.precio_unitario}
                onChange={handleChange}
                required
                margin="normal"
                inputProps={{ step: '0.01', min: '0' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre del Cliente"
                name="cliente_nombre"
                value={formData.cliente_nombre}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección del Cliente"
                name="cliente_direccion"
                value={formData.cliente_direccion}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
            {formData.cantidad && formData.precio_unitario && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, backgroundColor: '#E8F5E9' }}>
                  <Typography variant="h6" color="primary">
                    Total: Q{calcularTotal(formData.cantidad, formData.precio_unitario)}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: '#66BB6A',
              '&:hover': { backgroundColor: '#4CAF50' },
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

export default VentasPage;

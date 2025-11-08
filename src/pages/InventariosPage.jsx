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
import { Add, Edit, Delete, Inventory } from '@mui/icons-material';
import { inventariosService, categoriasInventarioService } from '../services/apiServices';

const InventariosPage = () => {
  const [inventarios, setInventarios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre_producto: '',
    categoria_id: '',
    cantidad: '',
    unidad: '',
    precio_unitario: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchInventarios();
    fetchCategorias();
  }, []);

  const fetchInventarios = async () => {
    try {
      const response = await inventariosService.getAll();
      if (response.success) {
        setInventarios(response.data);
      }
    } catch (error) {
      showSnackbar('Error al cargar inventarios', 'error');
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await categoriasInventarioService.getAll();
      if (response.success) {
        setCategorias(response.data);
      }
    } catch (error) {
      console.error('Error al cargar categorías');
    }
  };

  const handleOpenDialog = (inventario = null) => {
    if (inventario) {
      setEditingId(inventario.id);
      setFormData({
        nombre_producto: inventario.nombre_producto || '',
        categoria_id: inventario.categoria_id || '',
        cantidad: inventario.cantidad || '',
        unidad: inventario.unidad || '',
        precio_unitario: inventario.precio_unitario || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        nombre_producto: '',
        categoria_id: '',
        cantidad: '',
        unidad: '',
        precio_unitario: '',
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
        await inventariosService.update(editingId, formData);
        showSnackbar('Inventario actualizado exitosamente', 'success');
      } else {
        await inventariosService.create(formData);
        showSnackbar('Inventario creado exitosamente', 'success');
      }
      handleCloseDialog();
      fetchInventarios();
    } catch (error) {
      showSnackbar('Error al guardar inventario', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este registro?')) {
      try {
        await inventariosService.delete(id);
        showSnackbar('Inventario eliminado exitosamente', 'success');
        fetchInventarios();
      } catch (error) {
        showSnackbar('Error al eliminar inventario', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#FFA726', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Inventory sx={{ fontSize: 40 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Inventarios
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: '#F57C00',
              '&:hover': { backgroundColor: '#E65100' },
            }}
          >
            Nuevo Inventario
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#F5F2ED' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Producto</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Categoría</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Cantidad</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Unidad</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Precio Unit.</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventarios.map((inventario) => (
              <TableRow key={inventario.id} hover>
                <TableCell>{inventario.id}</TableCell>
                <TableCell>{inventario.nombre_producto || 'N/A'}</TableCell>
                <TableCell>{inventario.categoria_nombre || 'Sin categoría'}</TableCell>
                <TableCell>{inventario.cantidad || 0}</TableCell>
                <TableCell>{inventario.unidad || 'N/A'}</TableCell>
                <TableCell>Q{inventario.precio_unitario || '0.00'}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(inventario)}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(inventario.id)}
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
        <DialogTitle sx={{ backgroundColor: '#FFA726', color: 'white' }}>
          {editingId ? 'Editar Inventario' : 'Nuevo Inventario'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre del Producto"
                name="nombre_producto"
                value={formData.nombre_producto}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Categoría</InputLabel>
                <Select
                  name="categoria_id"
                  value={formData.categoria_id}
                  onChange={handleChange}
                  label="Categoría"
                  required
                >
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria.id} value={categoria.id}>
                      {categoria.categoria_nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Cantidad"
                name="cantidad"
                type="number"
                value={formData.cantidad}
                onChange={handleChange}
                required
                margin="normal"
                inputProps={{ min: '0' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Unidad"
                name="unidad"
                value={formData.unidad}
                onChange={handleChange}
                required
                margin="normal"
                placeholder="kg, L, unidades"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
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
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: '#FFA726',
              '&:hover': { backgroundColor: '#F57C00' },
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

export default InventariosPage;

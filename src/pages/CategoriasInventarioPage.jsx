import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Alert, Snackbar, Grid,
} from '@mui/material';
import { Add, Edit, Delete, Category } from '@mui/icons-material';
import { categoriasInventarioService } from '../services/apiServices';

const CategoriasInventarioPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ categoria_nombre: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await categoriasInventarioService.getAll();
      if (response.success) setCategorias(response.data);
    } catch (error) {
      showSnackbar('Error al cargar categorías', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await categoriasInventarioService.create(formData);
      showSnackbar('Categoría creada exitosamente', 'success');
      setOpenDialog(false);
      setFormData({ categoria_nombre: '' });
      fetchCategorias();
    } catch (error) {
      showSnackbar('Error al crear categoría', 'error');
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
            <Category sx={{ fontSize: 40 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>Categorías de Inventario</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            sx={{ backgroundColor: '#8E24AA', '&:hover': { backgroundColor: '#6A1B9A' } }}
          >
            Nueva Categoría
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#F5F2ED' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Nombre de Categoría</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias.map((cat) => (
              <TableRow key={cat.id} hover>
                <TableCell>{cat.id}</TableCell>
                <TableCell>{cat.categoria_nombre}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle sx={{ backgroundColor: '#AB47BC', color: 'white' }}>Nueva Categoría</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Nombre de Categoría"
            value={formData.categoria_nombre}
            onChange={(e) => setFormData({ categoria_nombre: e.target.value })}
            required
            margin="normal"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: '#AB47BC' }}>
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoriasInventarioPage;

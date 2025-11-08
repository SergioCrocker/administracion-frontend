import api from './api';

// Servicios de autenticación
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

// Servicios de ganado
export const ganadoService = {
  getAll: async () => {
    const response = await api.get('/ganado');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/ganado/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/ganado', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/ganado/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/ganado/${id}`);
    return response.data;
  },
};

// Servicios de salud del ganado
export const saludGanadoService = {
  getAll: async () => {
    const response = await api.get('/salud-ganado');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/salud-ganado', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/salud-ganado/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/salud-ganado/${id}`);
    return response.data;
  },
};

// Servicios de producción de leche
export const produccionLecheService = {
  getAll: async () => {
    const response = await api.get('/produccion-leche');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/produccion-leche', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/produccion-leche/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/produccion-leche/${id}`);
    return response.data;
  },
};

// Servicios de inventarios
export const inventariosService = {
  getAll: async () => {
    const response = await api.get('/inventarios');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/inventarios', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/inventarios/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/inventarios/${id}`);
    return response.data;
  },
};

// Servicios de categorías de inventario
export const categoriasInventarioService = {
  getAll: async () => {
    const response = await api.get('/categorias-inventario');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/categorias-inventario', data);
    return response.data;
  },
};

// Servicios de empleados
export const empleadosService = {
  getAll: async () => {
    const response = await api.get('/empleados');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/empleados', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/empleados/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/empleados/${id}`);
    return response.data;
  },
};

// Servicios de ventas
export const ventasService = {
  getAll: async () => {
    const response = await api.get('/ventas');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/ventas', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/ventas/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/ventas/${id}`);
    return response.data;
  },
};

// Servicios de alertas
export const alertasService = {
  getAll: async () => {
    const response = await api.get('/alertas');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/alertas', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/alertas/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/alertas/${id}`);
    return response.data;
  },
};

// Servicios de usuarios
export const usuariosService = {
  getAll: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  getRoles: async () => {
    const response = await api.get('/usuarios/roles');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/usuarios', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/usuarios/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },
};

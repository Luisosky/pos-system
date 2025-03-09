// Code to handle authentication requests to the server
import api from './api';

const API_URL = 'http://localhost:5000/api';

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  // Método de login
  login: async (credentials) => {
    try {
      console.log('Enviando credenciales al servidor:', {
        username: credentials.username,
        passwordLength: credentials.password.length
      });
      
      const response = await api.post('/auth/login', {
        username: String(credentials.username),
        password: String(credentials.password)
      });
      
      console.log('Respuesta recibida:', response.data);
      
      // Guardar el token y la información del usuario en localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error) {
      console.error('Error en authService.login:', error.response?.data || error.message);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  // Método para validar el token con el servidor
  validateToken: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      
      // Realizar una petición a una ruta protegida para validar el token
      const response = await fetch(`${API_URL}/auth/validate-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Token inválido');
      }
      
      return true;
    } catch (error) {
      console.error('Error validando token:', error);
      // Si hay un error, eliminar datos de autenticación
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  }
};

export default authService;
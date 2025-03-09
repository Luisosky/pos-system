// Code to handle authentication requests to the server
import api from './api';

const API_URL = 'http://localhost:5000/api';

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  // Una alternativa usando fetch directamente para el login
  login: async (credentials) => {
    try {
      const username = credentials.username?.trim();
      const password = credentials.password?.trim();
      
      if (!username || !password) {
        throw new Error('Credenciales incompletas');
      }
      
      console.log('AuthService: Usando fetch directamente para login');
      
      // Usar fetch en lugar de axios para probar
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error en respuesta:', errorData);
        throw new Error(errorData.message || 'Error de autenticación');
      }
      
      const data = await response.json();
      
      // Guardar token y datos del usuario
      const { token, user } = data;
      
      if (!token || !user) {
        throw new Error('Respuesta de servidor inválida');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('AuthService: Login exitoso con fetch, datos guardados');
      
      return data;
    } catch (error) {
      console.error('AuthService Error (fetch):', error);
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
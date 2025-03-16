// Code to handle authentication requests to the server
import api from './api';

const API_URL = 'http://localhost:5000/api';

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  //Using fetch for the login
  login: async (credentials) => {
    try {
      const username = credentials.username?.trim();
      const password = credentials.password?.trim();
      
      if (!username || !password) {
        throw new Error('Credenciales incompletas');
      }
      
      console.log('AuthService: Usando fetch directamente para login');
      
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
      
      // Save tokens and data user 
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
  
  // Method to validate the token
  validateToken: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      
      // Send token to server to validate
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  }
};

export default authService;
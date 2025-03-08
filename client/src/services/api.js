import axios from 'axios';

// Get the API URL from the environment variables
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to add the token to the headers
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor to handle 401 errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Clear the token and user from the local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to the login page (optional)
      // window.location = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
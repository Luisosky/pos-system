import api from './api';

// Test function to login directly from the frontend
export async function testLoginDirectly() {
  try {
    console.log('Iniciando prueba de login desde frontend...');
    
    // Test data for login credentials (hardcoded)
    const credentials = {
      username: 'admin',
      password: 'admin123'
    };
    
    console.log('Enviando credenciales:', credentials.username);
    
    // Doing the request with the hardcoded credentials
    const response = await api.post('/auth/login', credentials);
    
    console.log('Respuesta del servidor:', response);
    console.log('Status code:', response.status);
    console.log('Headers:', response.headers);
    console.log('Datos:', response.data);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('ERROR DETALLADO:');
    console.error('Mensaje:', error.message);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Status:', error.response.status);
      console.error('Datos:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request:', error.request);
    }
    
    return {
      success: false,
      error: error
    };
  }
}
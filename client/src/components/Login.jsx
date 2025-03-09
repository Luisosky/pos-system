import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  InputAdornment, 
  IconButton,
  Link
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import logoImage from '../assets/logo.png';
import authService from '../services/authService';

const Login = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [diagnosticResult, setDiagnosticResult] = useState(null);

  // Verify if demo mode is enabled
  const isDemoMode = process.env.REACT_APP_DEMO_MODE === 'true';
  
  // Component for demo credentials
  const DemoCredentials = () => {
    if (!isDemoMode) return null;
    
    return (
      <Box sx={{ mt: 2, p: 2, border: '1px dashed grey', borderRadius: 1 }}>
        <Typography variant="subtitle2" color="textSecondary">
          Credenciales de demostración:
        </Typography>
        <Box>
          <Typography variant="body2">
            Admin: admin / admin123
          </Typography>
          <Typography variant="body2">
            Cajero: cajero / cajero123
          </Typography>
        </Box>
      </Box>
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Al manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Simplificar el objeto de credenciales
      const cleanUsername = credentials.username.trim();
      const cleanPassword = credentials.password.trim();
      
      console.log(`Intentando login con: ${cleanUsername} / ${cleanPassword}`);
      
      const data = await authService.login({
        username: cleanUsername,
        password: cleanPassword
      });
      
      console.log('Respuesta del servidor:', data);
      onLogin(data.user);
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      setError(
        error.response?.data?.message || 
        'Error al iniciar sesión. Por favor, intente nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: '#f5f5f5'
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          width: '100%',
          maxWidth: '400px'
        }}
      >
        <Box 
          sx={{ 
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Box 
            component="img" 
            src={logoImage} 
            alt="Logo Tienda" 
            sx={{ 
              height: 80, 
              width: 'auto',
              mb: 2
            }}
          />
          <Typography variant="h5" component="h1" fontWeight="bold">
            SISTEMA DE PUNTO DE VENTA
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Usuario"
            name="username"
            autoComplete="username"
            autoFocus
            value={credentials.username}
            onChange={handleChange}
            sx={{ mb: 3 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 2, mb: 3 }}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'INICIAR SESIÓN'}
          </Button>
          
          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Box sx={{ textAlign: 'center' }}>
            <Link href="#" variant="body2">
              ¿Olvidó su clave?
            </Link>
          </Box>
        </Box>
        
        {/* DemoCredentials */}
        <DemoCredentials />

        {/* Herramienta de diagnóstico mejorada */}
        <Box sx={{ mt: 4, border: '1px dashed #ccc', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Herramienta de diagnóstico
          </Typography>
          
          <Button 
            onClick={async () => {
              try {
                setDiagnosticResult({status: 'loading', message: 'Ejecutando diagnóstico...'});
                
                // URL del backend
                const backendUrl = 'http://localhost:5000/api/auth/login';
                
                // Credenciales de prueba
                const testData = {
                  username: 'admin',
                  password: 'admin123'
                };
                
                // Intentar la conexión directamente
                const response = await fetch(backendUrl, {
                  method: 'POST', 
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(testData)
                });
                
                // Convertir la respuesta a JSON
                const data = await response.json();
                
                // Mostrar resultado detallado en UI
                setDiagnosticResult({
                  status: response.ok ? 'success' : 'error',
                  statusCode: response.status,
                  data: data,
                  message: response.ok 
                    ? 'Conexión exitosa con el servidor' 
                    : `Error: ${data.message || 'Desconocido'}`
                });
                
              } catch (error) {
                // Capturar cualquier error en la conexión
                setDiagnosticResult({
                  status: 'error',
                  message: `Error de conexión: ${error.message}`,
                  error: error.toString()
                });
              }
            }}
            fullWidth
            variant="outlined"
            color="secondary"
            sx={{ mb: 1 }}
          >
            Ejecutar diagnóstico
          </Button>
          
          {diagnosticResult && (
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: diagnosticResult.status === 'success' ? '#e8f5e9' : 
                       diagnosticResult.status === 'loading' ? '#e3f2fd' : 
                       '#ffebee', 
              borderRadius: 1 
            }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Estado: {diagnosticResult.status}
                {diagnosticResult.statusCode && ` (${diagnosticResult.statusCode})`}
              </Typography>
              
              <Typography variant="body2">
                {diagnosticResult.message}
              </Typography>
              
              {diagnosticResult.error && (
                <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {diagnosticResult.error}
                </Typography>
              )}
              
              {diagnosticResult.data && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption">Datos recibidos:</Typography>
                  <pre style={{ 
                    fontSize: '0.7rem', 
                    overflowX: 'auto', 
                    backgroundColor: '#f5f5f5',
                    padding: 8,
                    borderRadius: 4
                  }}>
                    {JSON.stringify(diagnosticResult.data, null, 2)}
                  </pre>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
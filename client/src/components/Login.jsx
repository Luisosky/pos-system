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

const Login = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const success = await onLogin(credentials.username, credentials.password);
      
      if (!success) {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
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

        {/* Diagnostic Button - Add in Login.jsx before closing the Paper */}
        <Box sx={{ mt: 2 }}>
          <Button 
            onClick={async () => {
              const { testLoginDirectly } = await import('../services/testAuthService');
              const result = await testLoginDirectly();
              
              if (result.success) {
                setError('Prueba exitosa. Revisa la consola para detalles');
              } else {
                setError('Prueba fallida. Revisa la consola para detalles');
              }
            }}
            fullWidth
            variant="outlined"
            color="secondary"
          >
            Diagnosticar Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import Navbar from './Navbar';

const ProductManagement = ({ username }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar 
        title="Gestión de Productos" 
        username={username} 
        userRole="admin" 
      />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Gestión de Productos
          </Typography>
          <Typography>
            Esta sección está en construcción. Aquí se implementará la gestión de productos
            cuando se conecte con el backend.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProductManagement;
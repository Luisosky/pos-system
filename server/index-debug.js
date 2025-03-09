
// Capturar errores no manejados
process.on('uncaughtException', (error) => {
  console.error('ERROR NO CAPTURADO:');
  console.error(error);
  process.exit(1);
});

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
// Importar fs con manejo de errores
let fs;
try {
  fs = require('fs');
  console.log('✓ fs cargado correctamente');
} catch (error) {
  console.error('Error cargando fs:', error);
  process.exit(1);
}

try {
  require('dotenv').config();
  console.log('✓ Variables de entorno cargadas');
  
  const logger = require('./src/utils/logger');
  console.log('✓ Logger cargado');
  
  const errorHandler = require('./src/middleware/errorHandler');
  console.log('✓ Error handler cargado');
  
  // Import routes
  console.log('Cargando rutas...');
  const authRoutes = require('./src/routes/auth');
  const userRoutes = require('./src/routes/users');
  const productRoutes = require('./src/routes/products');
  console.log('✓ Rutas cargadas');
  
  // Config
  const app = express();
  const PORT = process.env.PORT || 5000;
  
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/products', productRoutes);
  
  // Ruta raíz simplificada
  app.get('/', (req, res) => {
    res.send('<h1>POS System API</h1><p>API funcionando correctamente</p>');
  });
  
  app.use(errorHandler);
  
  // Connect to MongoDB and start server
  console.log('Conectando a MongoDB...');
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('✓ Conexión a MongoDB correcta');
      app.listen(PORT, () => {
        console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
      });
    })
    .catch(err => {
      console.error('Error conectando a MongoDB:', err.message);
      process.exit(1);
    });
} catch (error) {
  console.error('ERROR DE INICIALIZACIÓN:', error);
  process.exit(1);
}
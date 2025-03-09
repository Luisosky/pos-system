// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    console.error('ERROR NO CAPTURADO:', error);
    process.exit(1);
  });
  
  try {
    const express = require('express');
    console.log('✓ Express cargado');
    
    const cors = require('cors');
    console.log('✓ CORS cargado');
    
    const path = require('path');
    console.log('✓ Path cargado');
    
    const mongoose = require('mongoose');
    console.log('✓ Mongoose cargado');
    
    console.log('Cargando variables de entorno...');
    require('dotenv').config();
    console.log('✓ Variables de entorno cargadas');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Definida' : 'No definida');
    
    console.log('Cargando logger...');
    const logger = require('./src/utils/logger');
    console.log('✓ Logger cargado');
    
    console.log('Cargando middleware de errores...');
    const errorHandler = require('./src/middleware/errorHandler');
    console.log('✓ Middleware de errores cargado');
    
    console.log('Cargando rutas...');
    
    // Cargar rutas con manejo de errores
    let authRoutes, userRoutes, productRoutes;
    
    try {
      console.log('Cargando rutas de autenticación...');
      authRoutes = require('./src/routes/auth');
      console.log('✓ Rutas de autenticación cargadas');
    } catch (error) {
      console.error('ERROR AL CARGAR RUTAS DE AUTENTICACIÓN:', error);
      process.exit(1);
    }
    
    try {
      console.log('Cargando rutas de usuarios...');
      userRoutes = require('./src/routes/users');
      console.log('✓ Rutas de usuarios cargadas');
    } catch (error) {
      console.error('ERROR AL CARGAR RUTAS DE USUARIOS:', error);
      process.exit(1);
    }
    
    try {
      console.log('Cargando rutas de productos...');
      productRoutes = require('./src/routes/products');
      console.log('✓ Rutas de productos cargadas');
    } catch (error) {
      console.error('ERROR AL CARGAR RUTAS DE PRODUCTOS:', error);
      process.exit(1);
    }
    
    // Configuración
    console.log('Configurando Express...');
    const app = express();
    const PORT = process.env.PORT || 5000;
    
    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // Middleware de logging
    app.use((req, res, next) => {
      logger.info(`${req.method} ${req.url}`);
      next();
    });
    
    // Rutas
    console.log('Registrando rutas...');
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/products', productRoutes);
    
    // Ruta de prueba
    app.get('/api/test', (req, res) => {
      res.json({ message: 'API funcionando correctamente' });
    });
    
    // Middleware de manejo de errores
    app.use(errorHandler);
    
    // Conectar a MongoDB y iniciar servidor
    console.log('Conectando a MongoDB...');
    mongoose.connect(process.env.MONGODB_URI)
      .then(() => {
        console.log('✓ Conexión a MongoDB establecida correctamente');
        app.listen(PORT, () => {
          console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
        });
      })
      .catch(err => {
        console.error('ERROR AL CONECTAR A MONGODB:', err);
        process.exit(1);
      });
    
  } catch (error) {
    console.error('ERROR GLOBAL EN INICIO DEL SERVIDOR:', error);
    process.exit(1);
  }
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const logger = require('./src/utils/logger');
const errorHandler = require('./src/middleware/errorHandler');

// Import routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const productRoutes = require('./src/routes/products');

// Config
const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de CORS más detallada
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://tudominio.com'  // Dominio en producción
    : ['http://localhost:3000', 'http://127.0.0.1:3000'], // Dominios en desarrollo
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware of logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Verificación explícita del modo
const isProduction = process.env.NODE_ENV === 'production';
console.log(`Modo: ${isProduction ? 'PRODUCCIÓN' : 'DESARROLLO'}`);



// Servir archivos estáticos de React en producción
if (process.env.NODE_ENV === 'production') {
  try {
    const buildPath = path.join(__dirname, '../client/build');
    
    // Verificar si el directorio existe
    if (fs.existsSync(buildPath)) {
      app.use(express.static(buildPath));
      
      // Para cualquier ruta no definida en la API, enviar el index.html
      app.get('*', (req, res) => {
        const indexPath = path.join(buildPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).send('Error: El archivo index.html no existe en la carpeta build');
        }
      });
    } else {
      logger.error(`La carpeta de build no existe: ${buildPath}`);
      app.get('/', (req, res) => {
        res.status(500).send('Error: La aplicación React no ha sido construida. Ejecuta "npm run build" en la carpeta client.');
      });
    }
  } catch (error) {
    logger.error(`Error al servir archivos estáticos: ${error.message}`);
  }
} else {
  // En desarrollo, proporciona una respuesta para la raíz
  app.get('/', (req, res) => {
    res.send(`
      <h1>POS System API</h1>
      <p>Bienvenido a la API del Sistema de Punto de Venta</p>
      <p>Para acceder al cliente, debes iniciar el servidor de desarrollo de React (npm start en la carpeta client)</p>
      <h2>Rutas disponibles:</h2>
      <ul>
        <li><a href="/api/test">/api/test</a> - Prueba de funcionamiento de la API</li>
        <li><a href="/api/products">/api/products</a> - API de productos</li>
      </ul>
    `);
  });
}

// Middleware to handle errors
app.use(errorHandler);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info('Conexión a MongoDB establecida correctamente');
    app.listen(PORT, () => {
      logger.info(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    logger.error(`Error conectando a MongoDB: ${err.message}`);
    process.exit(1);
  });
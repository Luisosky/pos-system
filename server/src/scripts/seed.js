const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const User = require('../models/User');
const logger = require('../utils/logger');

async function seedUsers() {
  try {
    logger.info('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Conexión exitosa!');
    
    // Eliminar usuarios existentes
    await User.deleteMany({});
    logger.info('Usuarios anteriores eliminados');
    
    // Crear usuario administrador (sin mezclar con el username)
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      username: 'admin',
      password: adminPassword,
      role: 'admin'
    });
    await admin.save();
    logger.info('Usuario administrador creado');
    
    // Crear usuario cajero
    const cashierPassword = await bcrypt.hash('cajero123', 10);
    const cashier = new User({
      username: 'cajero',
      password: cashierPassword,
      role: 'cashier'
    });
    await cashier.save();
    logger.info('Usuario cajero creado');
    
    logger.info('Usuarios iniciales creados correctamente');
    
  } catch (error) {
    logger.error(`Error al crear usuarios iniciales: ${error.message}`);
  } finally {
    await mongoose.disconnect();
    logger.info('Desconectado de MongoDB');
  }
}

seedUsers();
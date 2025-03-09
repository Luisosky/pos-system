const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const User = require('../models/User');

async function updatePassword() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conexión exitosa!');
    
    // Actualizar la contraseña del administrador con el hash que se comprobó que funciona
    await User.updateOne(
      { username: 'admin' }, 
      { password: '$2b$10$g.jciN5kFGNl7FNfDQyFJ.wmrYBU3qZuQfHt.NpZ9nXQfdjDg33ja' }
    );
    console.log('Contraseña de admin actualizada correctamente!');
    
    // También vamos a actualizar la contraseña del cajero si existe
    const cashier = await User.findOne({ username: 'cajero' });
    if (cashier) {
      const bcrypt = require('bcrypt');
      const newCashierPassword = await bcrypt.hash('cajero123', 10);
      await User.updateOne(
        { username: 'cajero' }, 
        { password: newCashierPassword }
      );
      console.log('Contraseña del cajero también actualizada!');
    }
    
    // Verificar que la actualización funcionó
    const admin = await User.findOne({ username: 'admin' });
    const bcrypt = require('bcrypt');
    const isMatch = await bcrypt.compare('admin123', admin.password);
    console.log('Verificación de la actualización:', isMatch ? 'EXITOSA' : 'FALLIDA');
    
  } catch (error) {
    console.error('Error al actualizar contraseña:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
}

updatePassword();
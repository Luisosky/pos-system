const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const User = require('../models/User');

async function verifyPassword() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conexión exitosa!');
    
    // Verificar contraseña del admin
    const admin = await User.findOne({ username: 'admin' });
    if (!admin) {
      console.error('Error: Usuario admin no encontrado');
      return;
    }
    
    const testPassword = 'admin123';
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    
    console.log('--------------------');
    console.log('VERIFICACIÓN DE CONTRASEÑA');
    console.log('--------------------');
    console.log('Usuario: admin');
    console.log('Hash actual:', admin.password);
    console.log('Contraseña de prueba:', testPassword);
    console.log('¿Coinciden?:', isMatch ? 'SÍ' : 'NO');
    
    if (!isMatch) {
      console.log('');
      console.log('ERROR: La contraseña "admin123" no coincide con el hash almacenado');
      console.log('');
      
      // Ofrecer actualizar la contraseña
      console.log('¿Desea actualizar la contraseña a "admin123"?');
      console.log('Para actualizar, ejecute este comando:');
      console.log('');
      
      const newHash = await bcrypt.hash('admin123', 10);
      console.log(`node -e "const mongoose = require('mongoose'); require('dotenv').config(); const User = require('./src/models/User'); mongoose.connect(process.env.MONGODB_URI).then(() => User.findOneAndUpdate({ username: 'admin' }, { password: '${newHash}' }).then(() => { console.log('Contraseña actualizada a admin123'); mongoose.disconnect(); })).catch(err => console.error(err))"`);
    }
    
  } catch (error) {
    console.error('Error al verificar contraseña:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
}

verifyPassword();
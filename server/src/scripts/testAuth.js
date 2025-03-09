const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const User = require('../models/User');

async function testAuth() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conexión exitosa!');
    
    // Buscar el usuario admin
    const admin = await User.findOne({ username: 'admin' });
    
    if (!admin) {
      console.error('Error: Usuario admin no encontrado!');
      return;
    }
    
    console.log('Usuario encontrado:');
    console.log('- ID:', admin._id);
    console.log('- Username:', admin.username);
    console.log('- Role:', admin.role);
    console.log('- Password Hash:', admin.password);
    
    // Probar la contraseña
    const password = 'admin123';
    
    // Método 1: Usar el método de modelo
    if (admin.comparePassword) {
      try {
        const isMatchModel = await admin.comparePassword(password);
        console.log('Método 1 (comparePassword):', isMatchModel ? 'ÉXITO' : 'FALLO');
      } catch (e) {
        console.error('Error en método comparePassword:', e.message);
      }
    } else {
      console.log('El modelo no tiene el método comparePassword');
    }
    
    // Método 2: Comparación directa con bcrypt
    const isMatchDirect = await bcrypt.compare(password, admin.password);
    console.log('Método 2 (bcrypt.compare):', isMatchDirect ? 'ÉXITO' : 'FALLO');
    
    // Método 3: Comparación con prefijo (si tu método incluye el usuario)
    const combinedPassword = `${admin.username}:${password}`;
    const isMatchCombined = await bcrypt.compare(combinedPassword, admin.password);
    console.log('Método 3 (combinado con username):', isMatchCombined ? 'ÉXITO' : 'FALLO');
    
    // Crear nueva contraseña correcta
    console.log('\nCreando nuevo hash para admin123:');
    const newHash = await bcrypt.hash(password, 10);
    const newHashComparison = await bcrypt.compare(password, newHash);
    console.log('- Nuevo hash:', newHash);
    console.log('- Prueba del nuevo hash:', newHashComparison ? 'ÉXITO' : 'FALLO');
    
    // Actualizar la contraseña
    console.log('\n¿Deseas actualizar la contraseña? (ejecuta manualmente la siguiente línea):');
    console.log(`
    await User.updateOne({ username: 'admin' }, { password: '${newHash}' });
    console.log('Contraseña actualizada!');
    `);
    
  } catch (error) {
    console.error('Error en el test:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
}

testAuth();
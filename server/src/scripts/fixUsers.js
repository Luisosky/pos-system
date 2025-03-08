const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../../models/User');
const bcrypt = require('bcrypt');

async function fixUsers() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connection successful!');
    
    // Delete all previous users
    await User.deleteMany({});
    console.log('Usuarios anteriores eliminados');
    
    // Create admin with hashed password
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    await User.create({
      username: 'admin',
      email: 'admin@pos-system.com',
      password: adminPassword,
      role: 'admin'
    });
    
    console.log('Admin creado correctamente');
    
    // Cashier with simple hashed password
    const cashierPassword = await bcrypt.hash('cajero123', 10);
    
    await User.create({
      username: 'cajero',
      email: 'cajero@pos-system.com',
      password: cashierPassword,
      role: 'cashier'
    });
    
    console.log('Cajero creado correctamente');
    
    // Verify users
    const users = await User.find({}, { password: 0 });
    console.log('Usuarios recreados:', users);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  }
}

fixUsers();
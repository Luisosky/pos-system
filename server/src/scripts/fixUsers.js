const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function fixUsers() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connection successful!');
    
    // Delete all users to start from scratch
    await User.deleteMany({});
    console.log('Usuarios anteriores eliminados');
    
    // Create admin using the model that handles
    const admin = new User({
      username: 'admin',
      email: 'admin@pos-system.com',
      password: 'admin123', // It will hash in the pre-save
      role: 'admin'
    });
    
    await admin.save();
    console.log('Admin creado correctamente');
    
    // Create cashier using the model that handles
    const cajero = new User({
      username: 'cajero',
      email: 'cajero@pos-system.com',
      password: 'cajero123', // It will hash in the pre-save
      role: 'cashier'
    });
    
    await cajero.save();
    console.log('Cajero creado correctamente');
    
    // Verify that the users were created with rols
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
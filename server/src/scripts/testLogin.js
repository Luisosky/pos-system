const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');

async function testLogin() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connection successful!');
    
    const testUsername = 'admin';
    const testPassword = 'admin123';
    
    console.log(`Testing login for ${testUsername}`);
    
    // Find the user in the database
    const user = await User.findOne({ username: testUsername });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.error('User not found in database!');
      return;
    }
    
    console.log('User data:', {
      id: user._id,
      username: user.username,
      role: user.role,
      hashedPassword: user.password?.substring(0, 20) + '...' // Show only the first 20 characters
    });
    
    // Try to login with the test password and the user's username as salt for the hash function 
    const combinedPassword = `${user.username}:${testPassword}`;
    const isMatch = await bcrypt.compare(combinedPassword, user.password);
    
    console.log('Combined password:', combinedPassword);
    console.log('Password match result:', isMatch);
    
    if (isMatch) {
      console.log('¡Login exitoso! Las credenciales son correctas.');
    } else {
      console.log('Login fallido. Contraseña incorrecta.');
      console.log('Probar recreando el usuario con contraseña nueva.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  }
}

testLogin();
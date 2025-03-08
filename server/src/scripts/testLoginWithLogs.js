const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const logger = require('../utils/logger');
const bcrypt = require('bcrypt');

async function testLoginWithLogs() {
  try {
    logger.info('Iniciando prueba de login');
    logger.info('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connection successful!');
    
    const testUsername = 'admin';
    const testPassword = 'admin123';
    
    logger.info(`Testing login for ${testUsername}`);
    
    // Find the user
    const user = await User.findOne({ username: testUsername });
    
    if (!user) {
      logger.error(`User not found in database: ${testUsername}`);
      return;
    }
    
    logger.info(`User found: ${testUsername}, ID: ${user._id}, Role: ${user.role || 'NO ROLE'}`);
    
    // Test password manually
    const combinedPassword = `${testUsername}:${testPassword}`;
    logger.info(`Combined password for comparison: ${combinedPassword}`);
    
    const result = await bcrypt.compare(combinedPassword, user.password);
    logger.info(`Password match result: ${result}`);
    
    if (result) {
      logger.info('Login test successful!');
    } else {
      logger.warn('Login test failed: incorrect password');
    }
    
  } catch (error) {
    logger.error(`Error in login test: ${error.message}`, { stack: error.stack });
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB Atlas');
  }
}

testLoginWithLogs();
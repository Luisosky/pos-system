const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const User = require('../models/User');
const logger = require('../utils/logger');

async function seedDatabase() {
  try {
    logger.info('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connection successful!');
    
    // Delete previous users
    await User.deleteMany({});
    logger.info('Previous users deleted');
    
    // Create admin user (with email)
    const admin = new User({
      username: 'admin',
      email: 'admin@pos-system.com', 
      password: 'admin123',
      role: 'admin'
    });
    
    await admin.save();
    logger.info('Admin user created');
    
    // Create cashier user (without email)
    const cashier = new User({
      username: 'cajero',
      password: 'cajero123',
      role: 'cashier'
    });
    
    await cashier.save();
    logger.info('Cashier user created');
    
    logger.info('Database seeded successfully');
    
  } catch (error) {
    logger.error(`Error seeding database: ${error.message}`);
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  }
}

seedDatabase();
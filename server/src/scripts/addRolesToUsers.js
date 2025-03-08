const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function addRolesToUsers() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connection successful!');
    
    // Get all the users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);
    
    // Update the user 'admin' with role admin
    const adminResult = await User.updateOne(
      { username: 'admin' },
      { $set: { role: 'admin' } }
    );
    
    console.log(`Admin user updated: ${adminResult.modifiedCount} document(s)`);
    
    // Update the user 'cajero' with role cashier
    const cashierResult = await User.updateOne(
      { username: 'cajero' },
      { $set: { role: 'cashier' } }
    );
    
    console.log(`Cashier user updated: ${cashierResult.modifiedCount} document(s)`);
    
    // Update all the users that don't have a role
    const othersResult = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'cashier' } } // Default role cashier
    );
    
    console.log(`Other users updated: ${othersResult.modifiedCount} document(s)`);
    
    // Verificar los cambios
    const updatedUsers = await User.find({}, { password: 0 });
    console.log('Updated users:', updatedUsers);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  }
}

addRolesToUsers();
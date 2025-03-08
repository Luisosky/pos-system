const { connectDB, closeDB } = require('../config/db');
const mongoose = require('mongoose');

// Create a schema for testing
const TestSchema = new mongoose.Schema({
  name: String,
  value: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model for testing
const Test = mongoose.model('Test', TestSchema);

// Async function to run the test
const runTest = async () => {
  try {
    // Connect to the database
    console.log('Connecting to the database...');
    await connectDB();
    
    // Making a test document
    console.log('Making a test document...');
    const testItem = new Test({
      name: 'test-item',
      value: 'Test of MongoDB ' + new Date().toISOString()
    });
    
    // Save the document
    const savedItem = await testItem.save();
    console.log('Document saved successfully:');
    console.log(savedItem);
    
    // Find the document by name
    console.log('Finding all documents:');
    const allItems = await Test.find();
    console.log(`Found ${allItems.length} documents:`);
    allItems.forEach(item => console.log(` - ${item.name}: ${item.value}`));
    
    // Close connection
    await closeDB();
    console.log('All tests passed!');
    
  } catch (error) {
    console.error('Error in the connection:', error);
    // Try to close the connection
    try {
      await closeDB();
    } catch (err) {
      console.error('Error closing connection:', err);
    }
  }
};

// Execute the test
runTest();
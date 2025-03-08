const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    sparse: true, // Allow null values (optional email)
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'cashier'],
    default: 'cashier',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  // Include the username in the password hash
  const combinedPassword = `${this.username}:${this.password}`;
  this.password = await bcrypt.hash(combinedPassword, salt);
  next();
});

// Simplify the password comparison for debug
userSchema.methods.comparePassword = async function(password) {
  try {
    const combinedPassword = `${this.username}:${password}`;
    console.log('Combined password for comparison:', combinedPassword);
    const result = await bcrypt.compare(combinedPassword, this.password);
    console.log('bcrypt compare result:', result);
    return result;
  } catch (error) {
    console.error('Error comparing password:', error);
    return false;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
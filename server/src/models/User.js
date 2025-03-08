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

// Method to compare password for authentication
userSchema.methods.comparePassword = async function (password) {
  // Include the username in the password hash for comparison
  const combinedPassword = `${this.username}:${password}`;
  return await bcrypt.compare(combinedPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
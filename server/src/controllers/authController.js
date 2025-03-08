const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { hashPassword, comparePassword } = require('../utils/helpers');

// Register a new user
exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { username },
        ...(email ? [{ email }] : [])
      ] 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({
      username,
      ...(email && { email }),
      password: password, // The password will be hashed before saving
      role: role || 'cashier'
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username });
    
    // Find user by username
    const user = await User.findOne({ username });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas (usuario no encontrado)' });
    }
    
    console.log('User data:', {
      id: user._id,
      username: user.username,
      role: user.role,
      hasPassword: !!user.password
    });
    
    // Important! Use the username to hash the password
    console.log('Comparing password...');
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas (contraseña incorrecta)' });
    }
    
    // Create a token
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role || 'cashier' 
      },
      config.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role || 'cashier', 
        ...(user.email && { email: user.email })
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error del servidor: ' + error.message });
  }
};
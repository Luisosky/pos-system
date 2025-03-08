const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { hashPassword, comparePassword } = require('../utils/helpers');
const logger = require('../utils/logger'); // Importar logger

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
    logger.info(`Intento de login: ${username}`);
    
    // Find user by username
    const user = await User.findOne({ username });
    
    if (!user) {
      logger.warn(`Intento de login fallido: usuario no encontrado - ${username}`);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    logger.info(`Usuario encontrado: ${username}, ID: ${user._id}, Rol: ${user.role}`);
    
    // Verify password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      logger.warn(`Intento de login fallido: contraseña incorrecta - ${username}`);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    logger.info(`Login exitoso: ${username}, Rol: ${user.role}`);
    
    res.status(200).json({
      token, // JWT token
      user: {
        id: user._id,
        username: user.username,
        role: user.role || 'cashier' // With fallback
      }
    });
    
  } catch (error) {
    logger.error(`Error en autenticación: ${error.message}`, { 
      stack: error.stack 
    });
    res.status(500).json({ message: 'Error del servidor' });
  }
};
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');


exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Verify if user exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }
    
    // Create user (email is optional)
    const user = new User({
      username,
      ...(email && { email }), 
      password, 
      role: role || 'cashier'
    });
    
    await user.save();
    
    logger.info(`Usuario registrado: ${username}`);
    
    res.status(201).json({ message: 'Usuario creado exitosamente' });
    
  } catch (error) {
    logger.error(`Error en registro: ${error.message}`);
    next(error);
  }
};

// Login of user
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    logger.info(`Intento de login: ${username}`);
    
    // Find user
    const user = await User.findOne({ username });
    
    if (!user) {
      logger.warn(`Intento de login fallido: usuario no encontrado - ${username}`);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    // Verify password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      logger.warn(`Intento de login fallido: contraseña incorrecta - ${username}`);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role || 'cashier' },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );
    
    logger.info(`Login exitoso: ${username}, Rol: ${user.role}`);
    
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role || 'cashier'
      }
    });
    
  } catch (error) {
    logger.error(`Error en login: ${error.message}`);
    next(error);
  }
};
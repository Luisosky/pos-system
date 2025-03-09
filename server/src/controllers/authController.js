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

// Login
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // Validar que username es un string
    if (typeof username !== 'string' || typeof password !== 'string') {
      logger.warn(`Intento de login con formato incorrecto: ${JSON.stringify(req.body)}`);
      return res.status(400).json({ message: 'Formato de credenciales inválido' });
    }
    
    logger.info(`Intento de login: ${username}, con contraseña: ${password.substring(0, 1)}*** (longitud: ${password.length})`);
    
    // Buscar usuario
    const user = await User.findOne({ username });
    if (!user) {
      logger.warn(`Usuario no encontrado: ${username}`);
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }
    
    logger.info(`Usuario encontrado: ${user.username}, hash: ${user.password.substring(0, 10)}...`);
    
    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    logger.info(`Resultado de la comparación: ${isMatch}`);
    
    if (!isMatch) {
      logger.warn(`Contraseña incorrecta para usuario: ${username}`);
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }
    
    // Crear token
    const payload = {
      id: user._id,
      username: user.username,
      role: user.role
    };
    
    const token = jwt.sign(
      payload, 
      process.env.JWT_SECRET || 'your_jwt_secret', 
      { expiresIn: '24h' }
    );
    
    logger.info(`Login exitoso: ${username}`);
    
    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
    
  } catch (error) {
    logger.error(`Error en login: ${error.message}`);
    next(error);
  }
};

// Validar token
exports.validateToken = async (req, res) => {
  // Si el middleware de autenticación permitió llegar hasta aquí, el token es válido
  res.status(200).json({ 
    valid: true, 
    user: {
      id: req.user.id,
      role: req.user.role
    } 
  });
};
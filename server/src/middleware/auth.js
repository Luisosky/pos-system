const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  try {
    // Get token
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    
    next();
    
  } catch (error) {
    logger.error(`Error de autenticación: ${error.message}`);
    res.status(401).json({ message: 'Token inválido' });
  }
};
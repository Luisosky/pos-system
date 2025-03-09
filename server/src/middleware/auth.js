const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const auth = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      logger.warn('Acceso denegado: No se proporcionó header de autorización');
      return res.status(401).json({ message: 'Acceso denegado. Autenticación requerida' });
    }
    
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      logger.warn('Formato de token inválido');
      return res.status(401).json({ message: 'Formato de token inválido' });
    }
    
    const token = parts[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    
    logger.info(`Usuario ${decoded.id} autenticado correctamente`);
    next();
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logger.warn('Token expirado');
      return res.status(401).json({ message: 'Token expirado' });
    }
    
    logger.error(`Error de autenticación: ${error.message}`);
    res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = auth;
const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  
  // Validation errors from Mongoose
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Error de validación',
      errors: Object.values(err.errors).map(error => error.message)
    });
  }
  
  // Duplicate key error from Mongoose
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Datos duplicados',
      field: Object.keys(err.keyPattern)[0]
    });
  }
  
  // General error
  res.status(err.statusCode || 500).json({
    message: err.message || 'Error del servidor'
  });
};
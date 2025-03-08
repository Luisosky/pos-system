require('dotenv').config();

module.exports = {
  // MongoDB connection string
  DB_URI: process.env.MONGODB_URI || 'mongodb://localhost:28017/pos_system',
  
  // Server port
  PORT: process.env.PORT || 5000,
  
  // JWT secret for authentication
  JWT_SECRET: process.env.JWT_SECRET || 'pos_system_secret_key',
  
  // JWT token expiration (in seconds or string like '1h', '1d')
  JWT_EXPIRE: process.env.JWT_EXPIRE || '24h',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // API prefix
  API_PREFIX: '/api',
  
  // CORS allowed origins
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // Bcrypt salt rounds
  SALT_ROUNDS: 10
};
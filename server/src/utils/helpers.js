const bcrypt = require('bcrypt');
const logger = require('./logger');

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @param {string} username - Username (for custom salt)
 * @returns {Promise<string>} Hashed password
 */
exports.hashPassword = async (password, username) => {
  try {
    const salt = await bcrypt.genSalt(10);
    // Include username in the password hash to make it unique
    const combinedPassword = `${username}:${password}`;
    return await bcrypt.hash(combinedPassword, salt);
  } catch (error) {
    logger.error(`Error al hashear contraseña: ${error.message}`);
    throw error;
  }
};

/**
 * Verify if a password matches a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @param {string} username - Username (for custom salt)
 * @returns {Promise<boolean>} True if the password matches the hash, false otherwise
 */
exports.comparePassword = async (password, hash, username) => {
  try {
    const combinedPassword = `${username}:${password}`;
    return await bcrypt.compare(combinedPassword, hash);
  } catch (error) {
    logger.error(`Error al comparar contraseñas: ${error.message}`);
    return false;
  }
};
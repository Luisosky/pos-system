const bcrypt = require('bcrypt');
const logger = require('./logger');

/**
 * Hashea una contraseña usando bcrypt
 * @param {string} password - Contraseña en texto plano
 * @param {string} username - Nombre de usuario (para el sal personalizado)
 * @returns {Promise<string>} Contraseña hasheada
 */
exports.hashPassword = async (password, username) => {
  try {
    const salt = await bcrypt.genSalt(10);
    // Incluir el nombre de usuario en el hash para mayor seguridad
    const combinedPassword = `${username}:${password}`;
    return await bcrypt.hash(combinedPassword, salt);
  } catch (error) {
    logger.error(`Error al hashear contraseña: ${error.message}`);
    throw error;
  }
};

/**
 * Verifica si una contraseña coincide con su hash
 * @param {string} password - Contraseña en texto plano
 * @param {string} hash - Hash almacenado
 * @param {string} username - Nombre de usuario (para el sal personalizado)
 * @returns {Promise<boolean>} True si coinciden
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
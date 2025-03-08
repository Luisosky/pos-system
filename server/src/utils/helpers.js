const bcrypt = require('bcrypt');

const hashPassword = async (password, username) => {
  const saltRounds = 10;
  // Combine the username and the password before hashing
  const combinedPassword = `${username}:${password}`;
  return await bcrypt.hash(combinedPassword, saltRounds);
};

const comparePassword = async (password, hashedPassword, username) => {
  // Does the same thing as the hashPassword function just to verify it
  const combinedPassword = `${username}:${password}`;
  return await bcrypt.compare(combinedPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
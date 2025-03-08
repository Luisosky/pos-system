const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/helpers');

// Register a new user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

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

    // Hash the password with username for added security
    const hashedPassword = await hashPassword(password, username);

    // Create a new user
    const newUser = new User({
      username,
      ...(email && { email }),
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user exists by username or email
    const user = await User.findOne(
      email ? { email } : { username }
    );
    
    if (!user) {
      // Add console.log for debugging
      console.log(`Usuario no encontrado: ${username}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password using username in comparison
    const isMatch = await comparePassword(password, user.password, user.username);
    // Add console.log for debugging
    console.log(`Verificación de contraseña para ${username}: ${isMatch}`);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and assign a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        ...(user.email && { email: user.email }) 
      } 
    });
  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
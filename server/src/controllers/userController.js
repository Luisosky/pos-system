const User = require('../../models/User');
const { hashPassword } = require('../utils/helpers');

// Register a new user
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password, username);
    const newUser = new User({
      username,
      ...(email && { email }),
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Update user information
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, email, password } = req.body;

  try {
    const updatedData = {};
    if (username) updatedData.username = username;
    if (email) updatedData.email = email;
    
    // If the password is provided, hash it before updating (change of password)
    if (password) {
      const user = username ? username : (await User.findById(userId)).username;
      updatedData.password = await hashPassword(password, user);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select('-password');
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};
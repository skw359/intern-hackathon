const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = await User.findById(decoded.userId).select('-password');
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB with specific database name
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'Database0'
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Check if admin user exists, if not create it
  try {
    const adminUser = await User.findOne({ email: 'admin@admin' });
    if (!adminUser) {
      const newAdmin = new User({
        name: 'Admin',
        email: 'admin@admin',
        password: 'admin'
      });
      await newAdmin.save();
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
})
.catch((error) => console.error('MongoDB connection error:', error));

app.use(cors());
app.use(express.json());

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ token, userId: user._id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/workouts', (req, res) => {
  res.json([]);
});

app.post('/api/makeWorkout', (req, res) => {
  res.json({ success: true });
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
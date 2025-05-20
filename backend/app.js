const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use(cors());
app.use(express.json());

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API routes should be defined before the catch-all route
app.post('/api/auth/signup', (req, res) => {
  // Temporary signup response for testing
  const { email, password } = req.body;
  res.json({ token: 'test-token', email });
});

app.post('/api/auth/login', (req, res) => {
  // Temporary login response for testing
  res.json({ token: 'test-token' });
});

app.get('/api/workouts', (req, res) => {
  // Temporary workouts response for testing
  res.json([]);
});

app.post('/api/makeWorkout', (req, res) => {
  // Temporary workout creation response for testing
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
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

// Serve static files from the React frontend app
app.use('/login', express.static(path.join(__dirname, '../frontend/build')));

// Handle React routing, return all requests to React app
app.get('/login/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
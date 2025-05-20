const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use(cors());
app.use(express.json());

// // Basic health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'ok' });
// });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

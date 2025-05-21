const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/User');
const Workout = require('./models/Workout');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');
const workoutRoutes = require('./routes/workout');
const { generateWithGemini } = require('./services/gemini');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

app.use(cors());
app.use(express.json());

// Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      userId: user._id,
      name: user.name
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('name email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ name: user.name, email: user.email });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    console.log("Received profile data:", req.body);  // Log to verify
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId, 
      { name, email }, // Update only these fields
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);  // Send back updated user data
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});




// Register route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/survey', authMiddleware, async (req, res) => {
  try {
    const { age, weight, experience, gender } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user.userId,
        {
          survey: {
            age,
            weight,
            experience,
            gender,
            completed: true
          }
        },
        {new: true}
      );
      res.status(200).json({message: 'survey saved', survey: user.survey});
    } catch (error) {
      console.error('survey error:', error);
      res.status(500).json({ message: 'failed to save survey with error ' + error.message });
    }
  });
  
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all workouts
app.get('/api/workouts', authMiddleware, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.userId }).sort({ date: 1 });
    res.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ message: 'Failed to fetch workouts' });
  }
});

// Create a new workout
app.post('/api/makeWorkout', authMiddleware, async (req, res) => {
  try {
    const { description, date } = req.body;
    const newWorkout = new Workout({
      userId: req.user.userId,
      description,
      date
    });
    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (error) {
    console.error('Error creating workout:', error);
    res.status(500).json({ message: 'Failed to create workout' });
  }
});

// Add to your backend (Express)
app.put('/api/me', authMiddleware, async (req, res) => {
  try {
    const { age, weight, experience, gender } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { 'survey.age': age, 'survey.weight': weight, 'survey.experience': experience, 'survey.gender': gender, 'survey.completed': true },
      { new: true }
    );
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Update a workout
app.put('/api/workouts/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { description, date } = req.body;

    const updatedWorkout = await Workout.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { description, date },
      { new: true }
    );

    if (!updatedWorkout) {
      return res.status(404).json({ message: 'Workout not found or not authorized' });
    }

    res.json(updatedWorkout);
  } catch (error) {
    console.error('Error updating workout:', error);
    res.status(500).json({ message: 'Failed to update workout' });
  }
});

// Delete a workout
app.delete('/api/workouts/:id', authMiddleware, async (req, res) => {
  try {
    const workoutId = req.params.id;
    const deletedWorkout = await Workout.findOneAndDelete({
      _id: workoutId,
      userId: req.user.userId
    });

    if (!deletedWorkout) {
      return res.status(404).json({ message: 'Workout not found or not authorized to delete' });
    }

    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({ message: 'Failed to delete workout' });
  }
});

// app.js

// Generate + create endpoint
app.post('/api/generateWorkout', authMiddleware, async (req, res, next) => {
  try {
    const { description, date } = req.body; // date as "YYYY-MM-DD"
    const dateStr = date || new Date().toISOString().slice(0,10);

    // Build the schema‐prompt
    const prompt = `
Generate a single-day workout plan and return it only as valid JSON in exactly this shape:

{
  "title": "<short name of workout>",
  "date": "<YYYY-MM-DD>",
  "exercises": [
    {
      "name": "<exercise name>",
      "description": "<brief description>",
      "sets": <number>,
      "reps": <number>
    }
  ]
}

Do not output any extra text or markdown—only the JSON object.

WORKOUT NAME: "${description}"
DATE: "${dateStr}"
`;

    // 1) Call Gemini
    let raw = await generateWithGemini(prompt);

    // 2) Strip code fences
    raw = raw.trim()
      .replace(/^```(?:json)?\s*/, '')
      .replace(/\s*```$/, '');

    // 3) Extract the JSON block
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('No JSON object found in response');
    const jsonString = m[0];

    // 4) Parse it
    const planObj = JSON.parse(jsonString);

    // 5) Create a new Workout document
    const newWorkout = await Workout.create({
      userId:     req.user.userId,
      title:      planObj.title,
      date:       planObj.date,
      exercises:  planObj.exercises
    });

    // 6) Return the created workout
    res.status(201).json(newWorkout);
  } catch (err) {
    console.error('Generate+Create error:', err);
    next(err);
  }
});

// Serve React frontend
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

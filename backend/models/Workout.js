const mongoose = require('mongoose');

/**
 * Exercise Schema
 * Defines the structure for individual exercises within a workout
 */
const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  sets: {
    type: Number,
    required: true
  },
  reps: {
    type: Number,
    required: true
  }
});

/**
 * Workout Schema
 * Defines the structure for workout documents
 */
const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  exercises: {
    type: [exerciseSchema],
    required: true,
    validate: [arr => arr.length > 0, 'At least one exercise is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Workout', workoutSchema);
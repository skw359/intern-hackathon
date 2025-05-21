const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age must be a positive number']
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [0, 'Weight must be a positive number']
  },
  experience: {
    type: String,
    required: [true, 'Experience is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    message: 'Experience must be either Beginner, Intermediate, or Advanced'
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female'],
    message: 'Gender must be either Male or Female'
  }
}, { timestamps: true });

const Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;
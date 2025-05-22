const express = require('express');
const Survey = require('../models/Survey');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create a new survey
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { age, weight, experience, gender } = req.body;

    const newSurvey = new Survey({
      userId: req.user.userId,
      age,
      weight,
      experience,
      gender
    });

    await newSurvey.save();
    res.status(201).json(newSurvey);
  } catch (error) {
    console.error('Error creating survey:', error);
    res.status(500).json({ message: 'Failed to create survey' });
  }
});

// Get all surveys for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const surveys = await Survey.find({ userId: req.user.userId });
    res.json(surveys);
  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({ message: 'Failed to fetch surveys' });
  }
});

module.exports = router;
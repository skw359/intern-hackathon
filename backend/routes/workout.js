// backend/routes/workouts.js
const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const { generateWithGemini } = require('../services/gemini');

// Simple parser: expects Gemini to return lines like "Push-up – 3 x 12, rest 60s"
function parseGeminiOutput(text) {
  return text
    .split('\n')
    .map(line => {
      const match = line.match(/(.+?)\s*–\s*(\d+)\s*x\s*(\d+),\s*rest\s*(\d+)s/);
      if (!match) return null;
      return {
        name:        match[1].trim(),
        sets:        parseInt(match[2], 10),
        reps:        parseInt(match[3], 10),
        restSeconds: parseInt(match[4], 10)
      };
    })
    .filter(Boolean);
}

// POST /api/workouts/:id/generate
router.post('/:id/generate', async (req, res, next) => {
  try {
    const { description } = req.body;
    // 1) Call Gemini
    const aiText = await generateWithGemini(description);

    // 2) Parse into your schema format
    const plan = parseGeminiOutput(aiText);

    // 3) Save back to Mongo
    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      { description, plan },
      { new: true }
    );

    res.json(workout);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
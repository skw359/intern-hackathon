// backend/routes/workouts.js
const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const { generateWithGemini } = require('../services/gemini');

function parseGeminiOutput(raw) {
  // unwrap wrapper if needed
  if (typeof raw !== 'string' && raw.parts) {
    raw = raw.parts.map(p => p.text).join('');
  }

  // strip fences
  let txt = raw
    .trim()
    .replace(/^```(?:json)?\s*/gm, '')
    .replace(/\s*```$/gm, '');

  // extract the full array
  let jsonArray = extractJsonArray(txt);

  // remove trailing commas
  jsonArray = jsonArray
    .replace(/,\s*]/g, ']')
    .replace(/,\s*}/g, '}');

  // finally parse
  try {
    return JSON.parse(jsonArray);
  } catch (err) {
    console.error("Failed JSON:\n", jsonArray);
    throw err;
  }
}

function extractJsonArray(txt) {
  const start = txt.indexOf('[');
  if (start < 0) throw new Error("No '[' found in AI response");
  let depth = 0;
  for (let i = start; i < txt.length; i++) {
    if (txt[i] === '[') depth++;
    else if (txt[i] === ']') {
      depth--;
      if (depth === 0) {
        return txt.slice(start, i + 1);
      }
    }
  }
  throw new Error("Unbalanced brackets in AI response");
}

// POST /api/workouts/:id/generate
router.post('/:id/generate', async (req, res, next) => {
  try {
    const { description } = req.body;
    // 1) Call Gemini
    const aiText = await generateWithGemini(description);

    // 2) Parse into your schema format
    const plan = parseGeminiOutput(aiText);
    console.log(plan);

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

module.exports = { router, parseGeminiOutput };
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  sets: {
    type: Schema.Types.Mixed,
    required: true
  },
  reps: {
    type: Schema.Types.Mixed,
    required: true
  }
});

module.exports = mongoose.model('Exercise', exerciseSchema);

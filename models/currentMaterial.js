const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const currentMaterial = new Schema({
  materials: [
    {
      material: {
        type: String
      },
      amount: {
        type: Number
      },
      unit: {
        type: String
      }
    }
  ],
  lastUpdated: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('CurrentMaterial', currentMaterial);
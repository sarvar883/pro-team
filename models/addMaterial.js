const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addMaterialSchema = new Schema({
  disinfector: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
  createdAt: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('AddMaterial', addMaterialSchema);
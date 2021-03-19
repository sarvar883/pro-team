const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const anonsSchema = new Schema({
  adminId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  body: {
    type: String,
    required: true
  },
  writtenAt: {
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = mongoose.model('Anons', anonsSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  type: {
    type: String
  },
  name: {
    type: String
  },
  inn: {
    type: String
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }],
  contracts: [String],
  createdAt: {
    type: Date
  }
});

module.exports = mongoose.model('Client', clientSchema);
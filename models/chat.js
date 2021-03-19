const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  user1: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user2: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [
    {
      fromId: {
        type: String,
        required: true
      },
      fromName: {
        type: String,
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
    }
  ]
});


chatSchema.methods.addNewMessage = function (message) {
  this.messages.push(message);
  return this.save();
};


chatSchema.methods.editMessage = function (messageId, updatedBody) {
  this.messages.forEach(message => {
    if (message._id.toString() === messageId) {
      message.body = updatedBody;
    }
  });
  return this.save();
};


chatSchema.methods.deleteMessage = function (messageId) {
  let newMessages = this.messages.filter(message => message._id.toString() !== messageId.toString());
  this.messages = newMessages;
  return this.save();
};


module.exports = mongoose.model('Chat', chatSchema);
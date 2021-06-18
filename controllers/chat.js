const mongoose = require('mongoose');
const User = require('../models/user');
const Chat = require('../models/chat');
const Anons = require('../models/anons');
const io = require('../socket');


// exports.getAllUsers = (req, res) => {
//   User.find({ disabled: false })
//     .then(users => res.json(users))
//     .catch(err => console.log('getAllUsers ERROR', err));
// };


// get chats of logged in user
exports.getAllChatsOfUser = async (req, res) => {
  let users = await User.find({ disabled: false });
  let hasChatWith = [{}], usersWithChat = [], notHaveChatWith = [];

  Chat.find()
    .populate('user1')
    .populate('user2')
    .exec()
    .then(chats => {
      chats = chats.filter(chat => chat.user1._id.toString() === req.body.userId || chat.user2._id.toString() === req.body.userId);

      chats.forEach(chat => {
        if (chat.user1._id.toString() !== req.body.userId) {
          for (let i = 0; i < users.length; i++) {
            if (users[i].id.toString() === chat.user1._id.toString()) {
              hasChatWith.push({
                user: users[i],
                chatId: chat._id
              });
              usersWithChat.push(users[i]);
            }
          }
        }
        if (chat.user2._id.toString() !== req.body.userId) {
          for (let i = 0; i < users.length; i++) {
            if (users[i].id.toString() === chat.user2._id.toString()) {
              hasChatWith.push({
                user: users[i],
                chatId: chat._id
              });
              usersWithChat.push(users[i]);
            }
          }
        }
      });

      // subtraction of arrays: users - hasChatWith
      notHaveChatWith = users.filter(item => !usersWithChat.includes(item));

      return res.json({
        chats: chats,
        hasChatWith: usersWithChat,
        notHaveChatWith: notHaveChatWith
      });
    })
    .catch(err => console.log('getAllChatsOfUser ERROR', err));
};


exports.createChat = async (req, res) => {
  const user1 = await User.findById(req.body.user1);
  const user2 = await User.findById(req.body.user2);

  const chat = new Chat({
    _id: mongoose.Types.ObjectId(),
    user1: req.body.user1,
    user2: req.body.user2,
    messages: []
  });

  chat.save()
    .then(createdChat => {
      const newObject = {
        _id: chat._id,
        user1: user1,
        user2: user2,
        messages: []
      };
      io.getIO().emit('createChat', {
        user1: user1,
        user2: user2,
        chat: createdChat
      });
      return res.json(newObject);
    })
    .catch(err => console.log('createChat ERROR', err));
};


exports.getCurrentChat = (req, res) => {
  const chatId = req.params.chatId;
  Chat.findById(chatId)
    .populate('user1')
    .populate('user2')
    .exec()
    .then(chat => res.json(chat))
    .catch(err => res.status(400).json(err));
};


exports.createMessage = (req, res) => {
  const chatId = req.body.object.chatId;
  const fromId = req.body.object.fromId;
  const fromName = req.body.object.fromName;
  const body = req.body.object.body;
  const date = new Date();

  const message = {
    _id: mongoose.Types.ObjectId(),
    fromId: fromId,
    fromName: fromName,
    body: body,
    writtenAt: date
  };

  Chat
    .findById(chatId)
    .then(chat => {
      chat.addNewMessage(message);
      io.getIO().emit(`createMessageInChat${chatId}`, {
        chatId: chatId,
        message: message
      });
      return res.json(message);
    })
    .catch(err => {
      console.log('createMessage ERROR', err);
      return res.status(400).json(err);
    });
};


exports.editMessage = (req, res) => {
  const chatId = req.body.object.chatId;
  const messageId = req.body.object.messageId;
  const updatedBody = req.body.object.updatedBody;

  Chat.findById(chatId)
    .then(chat => {
      chat.editMessage(messageId, updatedBody);
      io.getIO().emit(`editMessageInChat${chatId}`, {
        chatId: chatId,
        messageId: messageId,
        updatedBody: updatedBody
      });
      return res.json({
        chatId: chatId,
        messageId: messageId,
        updatedBody: updatedBody
      });
    })
    .catch(err => {
      console.log('editMessage ERROR', err);
      return res.status(400).json(err);
    });
};


exports.deleteMessage = (req, res) => {
  const chatId = req.body.chatId;
  const messageId = req.body.messageId;

  Chat
    .findById(chatId)
    .then(chat => {
      chat.deleteMessage(messageId);
      io.getIO().emit(`deleteMessageInChat${chatId}`, {
        chatId: chatId,
        messageId: messageId
      });
      return res.json({
        chatId: chatId,
        messageId: messageId
      });
    })
    .catch(err => {
      console.log('deleteMessage ERROR', err);
      return res.status(400).json(err);
    });
};


exports.createAnons = (req, res) => {
  const adminId = req.body.object.adminId;
  const body = req.body.object.body;

  const anons = new Anons({
    adminId: adminId,
    body: body
  });

  anons.save()
    .then(() => {
      Anons.findOne(anons)
        .populate('adminId')
        .exec()
        .then(newAnons => {
          io.getIO().emit('createAnons', {
            anons: newAnons
          });
          return res.json(newAnons);
        })
    })
    .catch(err => {
      console.log('createAnons ERROR', err);
      return res.status(400).json(err);
    });
};


exports.getAllAnons = (req, res) => {
  Anons.find()
    .populate('adminId')
    .exec()
    .then(allAnons => res.json(allAnons))
    .catch(err => {
      console.log('getAllAnons ERROR', err);
      return res.status(400).json(err);
    });
};
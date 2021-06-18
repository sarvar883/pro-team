const express = require('express');
const passport = require('passport');
const router = express.Router();

const chatController = require('../controllers/chat');

// router.get('/get-all-users', passport.authenticate('jwt', { session: false }), chatController.getAllUsers);

router.post(
  '/get-all-chats-of-user',
  passport.authenticate('jwt', { session: false }),
  chatController.getAllChatsOfUser
);

router.post(
  '/createChat',
  passport.authenticate('jwt', { session: false }),
  chatController.createChat
);

router.get(
  '/:chatId',
  passport.authenticate('jwt', { session: false }),
  chatController.getCurrentChat
);

router.post(
  '/create-message',
  passport.authenticate('jwt', { session: false }),
  chatController.createMessage
);

router.post(
  '/edit-message',
  passport.authenticate('jwt', { session: false }),
  chatController.editMessage
);

router.post(
  '/delete-message',
  passport.authenticate('jwt', { session: false }),
  chatController.deleteMessage
);

router.post(
  '/create-announcement',
  passport.authenticate('jwt', { session: false }),
  chatController.createAnons
);

router.post(
  '/get-all-anons',
  passport.authenticate('jwt', { session: false }),
  chatController.getAllAnons
);

module.exports = router;
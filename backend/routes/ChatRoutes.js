// routes/chatRoutes.js
const router = require('express').Router();
const { protectionMW } = require('../Controller/authController');
const { envoyerMessage, recupererMessages } = require('../Controller/chatController');

router.route('/annonces/:id/messages')
  .get(protectionMW, recupererMessages)
  .post(protectionMW, envoyerMessage);

module.exports = router;

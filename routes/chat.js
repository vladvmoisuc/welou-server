const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');

router.get('/chatroom', chatController.getChat);
router.get('/messages', chatController.getMessages);
router.post('/', chatController.createChat);
router.post('/chatroom', chatController.editChat);
router.post('/chatroom/leave', chatController.leaveChat);
router.post('/message', chatController.sendMessage);

module.exports = router;

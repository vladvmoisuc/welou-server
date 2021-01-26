const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');

router.post('/', chatController.createChat);
router.post('/message', chatController.sendMessage);
router.get('/messages', chatController.getMessages);
router.get('/chatroom', chatController.getChat);
router.post('/chatroom', chatController.editChat);
router.post('/chatroom/leave', chatController.leaveChat);

module.exports = router;

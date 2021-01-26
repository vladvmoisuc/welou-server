const express = require('express');
const user = require('./user');
const chat = require('./chat');
const notification = require('./notification');

const router = express.Router();

router.use('/user', user);
router.use('/chat', chat);
router.use('/notification', notification);

module.exports = router;

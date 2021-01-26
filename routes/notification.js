const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification');

router.post('/', notificationController.send);

module.exports = router;

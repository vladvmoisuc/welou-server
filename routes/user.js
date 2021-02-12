const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/', userController.getUser);
router.get('/notifications', userController.getNotifications);
router.get('/random', userController.getRandomMatch);
router.post('/', userController.createUser);
router.post('/delete', userController.deleteUser);
router.post('/notification/accept', userController.acceptRequest);
router.post('/notification/decline', userController.declineRequest);
router.post('/reject', userController.rejectUser);
router.post('/request', userController.sendRequest);
router.post('/update', userController.updateUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/', userController.createUser);
router.post('/delete', userController.deleteUser);
router.post('/update', userController.updateUser);
router.get('/', userController.getUser);
router.get('/random', userController.getRandomUser);
router.post('/reject', userController.rejectUser);
router.post('/request', userController.sendRequest);
router.get('/notifications', userController.getNotifications);
router.post('/notification/accept', userController.acceptRequest);
router.post('/notification/decline', userController.declineRequest);

module.exports = router;

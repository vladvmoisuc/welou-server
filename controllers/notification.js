const fcm = require('../fcm');

const send = async (req, res, next) => {
  try {
    await fcm.sendPushNotification(req.body);

    res.status(201).json('Notification sent succesfull.');
  } catch (error) {
    res.send(500);
  }
};

module.exports = { send };

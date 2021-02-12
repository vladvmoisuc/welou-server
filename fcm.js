var admin = require('firebase-admin');

const initialize = () => {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
};

const sendPushNotification = async ({ token, title, message, icon, type }) => {
  var message = {
    notification: {
      title,
      body: message,
    },
    webpush: {
      fcm_options: {
        link: process.env.DOMAIN,
      },
      notification: {
        icon,
        click_action: process.env.DOMAIN,
      },
    },
    data: {
      type,
    },
    token,
  };

  try {
    console.log(message);
    const response = await admin.messaging().send(message);

    console.log('Successfully sent message:', response);
  } catch (error) {
    console.log('Error sending message: ', error);
    throw error;
  }
};

module.exports = {
  initialize,
  sendPushNotification,
};

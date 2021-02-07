var admin = require('firebase-admin');

const initialize = () => {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://chat-efca7.firebaseio.com',
  });
};

const sendPushNotification = async ({
  token,
  title,
  message,
  link,
  icon,
  type,
}) => {
  var message = {
    notification: {
      title,
      body: message,
    },
    webpush: {
      fcm_options: {
        link: 'https://welou-heroku.herokuapp.com',
      },
      notification: {
        icon,
        click_action: 'https://welou-heroku.herokuapp.com',
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

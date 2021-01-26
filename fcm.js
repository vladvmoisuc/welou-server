var admin = require('firebase-admin');

const initialize = () => {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://chat-efca7.firebaseio.com',
  });

  //   admin
  //     .auth()
  //     .getUser('KttKMjYghaMpvd1qjtEVYJeyHEq2')
  //     .then((userRecord) => {
  //       // See the UserRecord reference doc for the contents of userRecord.
  //       console.log(
  //         `Successfully fetched user data: ${JSON.stringify(userRecord.toJSON())}`
  //       );
  //     })
  //     .catch((error) => {
  //       console.log('Error fetching user data:', error);
  //     });
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
      // fcm_options: {
      //   link
      // },
      notification: {
        icon,
      },
    },
    data: {
      type,
    },
    token,
  };

  try {
    const response = await admin.messaging().send(message);

    console.log('Successfully sent message:', response);
  } catch (error) {
    console.log('Error sending message:', error);
  }
};

module.exports = {
  initialize,
  sendPushNotification,
};

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/messaging';

const firebaseConfig =
  process.env.NODE_ENV === 'production'
    ? {
        apiKey: 'AIzaSyCoWLr6REWQZXG9VAYBaT3mqI0l-hO8IEw',
        authDomain: 'welou-e916e.firebaseapp.com',
        projectId: 'welou-e916e',
        storageBucket: 'welou-e916e.appspot.com',
        messagingSenderId: '303879016002',
        appId: '1:303879016002:web:4c89fd4505065944a127db',
      }
    : {
        apiKey: 'AIzaSyDc31B3urAJuN2WTDnysXC8BMpQZ3hAubw',
        authDomain: 'chat-efca7.firebaseapp.com',
        databaseURL: 'https://chat-efca7.firebaseio.com',
        projectId: 'chat-efca7',
        storageBucket: 'chat-efca7.appspot.com',
        messagingSenderId: '59785229774',
        appId: '1:59785229774:web:914233c63dd52de4a8679f',
      };

const googleFirebase = firebase.initializeApp(firebaseConfig);
export const database = googleFirebase.firestore();
const messaging = firebase.messaging();

export const handleUserDelete = () => {
  firebase.auth().onAuthStateChanged(async function (user) {
    if (user) {
      await user.delete();
    }
  });
};

export const getMessagingToken = async () => {
  try {
    const currentToken = await messaging.getToken({
      vapidKey:
        process.env.NODE_ENV === 'production'
          ? 'BKCE6pranSLwR4HWaSXS2E0IORv3zijTl7cVY1RXFrskZixTepCp1KZ3SpqA2dI_ttZ7mY0y29fQ6ttDNZgI6DY'
          : 'BPPa6S-jBg_g3uw38iA-eILPRtlD9F1O7DFrBQnd-xOdhSORHjABXgT5zFjyLuNvm7mDkguwmSeHKT9YtHLJsHo',
    });

    return currentToken;
  } catch (error) {
    return false;
  }
};

export const onMessageListener = (callback) => {
  messaging.onMessage((payload) => {
    callback(payload);
  });
};

export const loginWithFacebook = async () => {
  try {
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().languageCode = 'ro_RO';
    firebase.auth().signInWithRedirect(provider);
  } catch (error) {
    console.log(`Facebook login error.`);
  }
};

export const getFacebookLoginData = async (callback) => {
  try {
    const {
      credential: { accessToken },
      additionalUserInfo: {
        isNewUser,
        profile: {
          first_name,
          last_name,
          id,
          picture: {
            data: { url },
          },
        },
      },
    } = await firebase.auth().getRedirectResult();
    return {
      accessToken,
      isNewUser,
      first_name,
      last_name,
      id,
      url,
    };
  } catch ({ code, message, email }) {
    console.log(
      `Failure to log the user with email: ${email}. Code ${code} - ${message}`
    );
    callback();
  }
};

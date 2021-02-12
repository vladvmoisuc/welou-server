const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');

const initializeFirebase = () => {
  const firebaseConfig =
    process.env.ENVIRONMENT === 'production'
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

  return firebase.initializeApp(firebaseConfig);
};

module.exports = initializeFirebase;

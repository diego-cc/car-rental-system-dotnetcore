/**
 * Firebase.js
 */
import firebase from 'firebase';

/**
 * Basic configuration object to connect to firebase
 * @type {{storageBucket: *, apiKey: *, messagingSenderId: *, appId: *, projectId: string, databaseURL: *, authDomain: *}}
 */
const config = {
  apiKey: process.env.API_KEY || 'AIzaSyBN2bR0_A7pSJQ3W-yU8_e8jgfj1HVHg98',
  authDomain: process.env.AUTH_DOMAIN || 'car-rental-system-725f7.firebaseapp.com',
  databaseURL: process.env.DATABASE_URL || 'https://car-rental-system-725f7.firebaseio.com',
  projectId: process.env.PROJECT_ID || 'car-rental-system-725f7',
  storageBucket: process.env.STORAGE_BUCKET || 'car-rental-system-725f7.appspot.com',
  messagingSenderId: process.env.MESSAGING_SENDER_ID || '533494537845',
  appId: process.env.APP_ID || '533494537845:web:8886eede71aaf00dde623c'
};

firebase.initializeApp(config);

export { firebase };

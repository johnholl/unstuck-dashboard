import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyD0ozzK74cKX-_FeMtyoCkeAF47TmdDdQM',
  authDomain: 'unstuck-backend.firebaseapp.com',
  databaseURL: 'https://unstuck-backend.firebaseio.com',
  projectId: 'unstuck-backend',
  storageBucket: 'unstuck-backend.appspot.com',
  messagingSenderId: '64774095156',
  appId: '1:64774095156:web:868a8c970f6fb4b0f52561',
};

firebase.initializeApp(firebaseConfig);

// firebase.auth().useEmulator('http://localhost:9099/');
// firebase.firestore().useEmulator("localhost", 8080);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

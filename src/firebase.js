import firebase from 'firebase';

// const firebaseConfig = {
//   apiKey: 'AIzaSyD0ozzK74cKX-_FeMtyoCkeAF47TmdDdQM',
//   authDomain: 'unstuck-backend.firebaseapp.com',
//   databaseURL: 'https://unstuck-backend.firebaseio.com',
//   projectId: 'unstuck-backend',
//   storageBucket: 'unstuck-backend.appspot.com',
//   messagingSenderId: '64774095156',
//   appId: '1:64774095156:web:868a8c970f6fb4b0f52561',
// };

const firebaseConfig = {
  apiKey: 'AIzaSyD4z5-wpSrD5RUs90aKpZfoDnye7Y_2eAo',
  authDomain: 'unstuck-backend-a5061.firebaseapp.com',
  projectId: 'unstuck-backend-a5061',
  storageBucket: 'unstuck-backend-a5061.appspot.com',
  messagingSenderId: '1006019411461',
  appId: '1:1006019411461:web:23740cd1025e4511be666c',
  measurementId: 'G-TZV4RRC9ZK',
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const functions = firebase.functions();
export const storage = firebase.storage();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

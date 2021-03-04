import * as firebase from 'firebase';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAYklclL8vR5qNihwWD94N4sOkCmxKqJ-4",
  authDomain: "cube-wars-app.firebaseapp.com",
  databaseURL: "https://cube-wars-app.firebaseio.com",
  projectId: "cube-wars-app",
  storageBucket: "cube-wars-app.appspot.com",
  messagingSenderId: "319378673077",
  appId: "1:319378673077:web:792a5147d20ed44e171dfc",
  measurementId: "G-4E2HV0N7FX"
};


export default firebase;
export const firebaseAdmin = firebase.initializeApp(firebaseConfig);
export const db = firebaseAdmin.firestore();
export const auth = firebaseAdmin.auth();
export const storage = firebase.storage();
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyARXD0W3UaIB8LiLQJPq4E95PtOBg6Z64k",
  authDomain: "kjsieit-canteen.firebaseapp.com",
  databaseURL: "https://kjsieit-canteen.firebaseio.com",
  projectId: "kjsieit-canteen",
  storageBucket: "kjsieit-canteen.appspot.com",
  messagingSenderId: "578576433150",
  appId: "1:578576433150:web:eda7c01ed910f2106b4aaf",
  measurementId: "G-RCBT5B9574",
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };

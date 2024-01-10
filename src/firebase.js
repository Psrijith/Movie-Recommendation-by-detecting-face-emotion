// import firebase from "firebase";
import firebase from 'firebase/app';
import 'firebase/auth'; // Import the authentication module
import 'firebase/firestore'; // Import the Firestore module

// const firebaseConfig = {
//   apiKey: "AIzaSyB8SfanXKR7crwqE1uum8-a4FJS9aiqm7o",
//   authDomain: "netflix-clone-project-5a44c.firebaseapp.com",
//   projectId: "netflix-clone-project-5a44c",
//   storageBucket: "netflix-clone-project-5a44c.appspot.com",
//   messagingSenderId: "498168616514",
//   appId: "1:498168616514:web:07180eef3118ba6189ffdb"
// };

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJjgBw04XglX_AjCB_3FZw6LCt8zlRKaU",
  authDomain: "summer-internship-37d49.firebaseapp.com",
  projectId: "summer-internship-37d49",
  storageBucket: "summer-internship-37d49.appspot.com",
  messagingSenderId: "330160557502",
  appId: "1:330160557502:web:0c8b0557c10c2bd7687def",
  measurementId: "G-YYZG8M3WV9"
};


const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()
const auth = firebase.auth()

export { auth };
export default db;
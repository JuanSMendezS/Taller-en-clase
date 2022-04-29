import firebase from "firebase/app";
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBaWIVUGxKJEChd_HKm-LP1ktWydqTzXCw",
  authDomain: "taller-react-fd4d2.firebaseapp.com",
  projectId: "taller-react-fd4d2",
  storageBucket: "taller-react-fd4d2.appspot.com",
  messagingSenderId: "380846242735",
  appId: "1:380846242735:web:be414be67f8a52acbf8d5a",
  measurementId: "G-YRF20EKY2E"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export {firebase}
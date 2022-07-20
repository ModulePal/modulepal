import * as firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = { // YOUR FIREBASE CONFIG OBJECT GOES HERE
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);

firebaseApp.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();

export const signInWithGoogle = () => {
  firebaseApp.auth().signInWithPopup(googleProvider)
};

export const signInWithFacebook = () => {
  firebaseApp.auth().signInWithPopup(facebookProvider);
};

export default firebaseApp;
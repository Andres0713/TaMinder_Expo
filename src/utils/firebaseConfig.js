// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDSyPw7gRVIt22u3gZ1D6lemkC5SLO77A",
  authDomain: "tamindermovil.firebaseapp.com",
  projectId: "tamindermovil",
  storageBucket: "tamindermovil.firebasestorage.app",
  messagingSenderId: "181062141302",
  appId: "1:181062141302:web:fe5e4270f7bd5c7082e657"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
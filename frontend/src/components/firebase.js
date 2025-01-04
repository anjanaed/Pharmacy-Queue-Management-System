// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2Z1GILEQ13_1WUjmWHVXl6X0Fh0K3XH8",
  authDomain: "queue-management-87492.firebaseapp.com",
  projectId: "queue-management-87492",
  storageBucket: "queue-management-87492.firebasestorage.app",
  messagingSenderId: "213612844413",
  appId: "1:213612844413:web:91497584f5bdb313e7e814",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const fireStore = getFirestore(app);
export default app;

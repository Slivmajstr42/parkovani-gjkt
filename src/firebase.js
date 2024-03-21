import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhnWZc-328CcYqJ2RpxJMOZcaXp063nv0",
  authDomain: "slivkomaturitniprojekt.firebaseapp.com",
  projectId: "slivkomaturitniprojekt",
  storageBucket: "slivkomaturitniprojekt.appspot.com",
  messagingSenderId: "264728638260",
  appId: "1:264728638260:web:91108257adc73ad6006b61",
  measurementId: "G-NWH2KPY9KL",
};

const app = initializeApp(firebaseConfig);

export const authentication = getAuth(app);
export const db = getFirestore(app);

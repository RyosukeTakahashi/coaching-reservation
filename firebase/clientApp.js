import * as firebase from "firebase/app";
import "firebase/auth"; // If you need it
import "firebase/firestore"; // If you need it
import "firebase/storage"; // If you need it
import "firebase/analytics"; // If you need it

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: "coach-flow",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check that `window` is in scope for the analytics module!
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  // To enable analytics. https://firebase.google.com/docs/analytics/get-started
  // if ("measurementId" in clientCredentials) firebase.analytics();
}

export default firebase;

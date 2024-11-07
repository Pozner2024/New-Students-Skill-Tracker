// Firebase configuration and imports
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

/// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  testVariable: process.env.FIREBASE_TEST_VARIABLE,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Initialize the Realtime Database
const auth = getAuth(app); // Initialize authentication

console.log("Firebase Test Variable:", firebaseConfig.testVariable);

// Function for user sign-in
export function signInUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User signed in successfully:", userCredential.user);
      return userCredential.user;
    })
    .catch((error) => {
      console.error("Sign-in error:", error);
      throw error;
    });
}

// Function for user registration
export function registerUser(email, password) {
  console.log("Attempting to register user:", email);

  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User registered successfully:", user);
      return user; // Return the user object
    })
    .catch((error) => {
      console.error("Registration error:", error.code, error.message);
      throw error; // Throw an error for further handling
    });
}

// Function to save the user profile in the Realtime Database
export function saveUserProfile(userId, email) {
  return set(ref(database, "users/" + userId), {
    email: email, // Save the user's email
  })
    .then(() => {
      console.log("User profile saved with email.");
    })
    .catch((error) => {
      console.error("Error saving user profile:", error);
    });
}

// New function to save additional user data (name, group) in the Realtime Database
export function saveToDatabase(userId, userData) {
  return set(ref(database, "users/" + userId), userData) // Save the full user data
    .then(() => {
      console.log("User data successfully saved to Firebase:", userData);
    })
    .catch((error) => {
      console.error("Error saving user data to Firebase:", error);
    });
}

// Export initialized Firebase app and objects
export { app, database, auth };

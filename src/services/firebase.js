// Firebase configuration
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAOOnHfKxsALLM1dklRVrCTo49Bw22AbiI",
  authDomain: "tibia-party-finder.firebaseapp.com",
  projectId: "tibia-party-finder",
  storageBucket: "tibia-party-finder.firebasestorage.app",
  messagingSenderId: "991078066700",
  appId: "1:991078066700:web:d57d1af9341068cdfe9c29"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)
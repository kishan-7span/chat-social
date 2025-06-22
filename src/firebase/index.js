// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA1HujoUd1ZZXyi_qqwLQTivX_wGFJboOo',
  authDomain: 'chat-social-7ff10.firebaseapp.com',
  projectId: 'chat-social-7ff10',
  storageBucket: 'chat-social-7ff10.firebasestorage.app',
  messagingSenderId: '973224318036',
  appId: '1:973224318036:web:2acfe7ba314fd25fb5c9c1',
  measurementId: 'G-3EMJ09G78T',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
export const db = getFirestore(app)
export const auth = getAuth(app)

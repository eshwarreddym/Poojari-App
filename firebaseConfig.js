import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAOk52bH4lbXt4SzeX5snuGRZPPfuLpaNc",
  authDomain: "pooja-app-a6718.firebaseapp.com",
  projectId: "pooja-app-a6718",
  storageBucket: "pooja-app-a6718.appspot.com",
  messagingSenderId: "865328475846",
  appId: "1:865328475846:web:eb3900c66b6b476e68f1c7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCMIX5IVsWYdsKyq8cZWOxncmRbIfzyqaY",
  authDomain: "pooja-app-4a4e4.firebaseapp.com",
  projectId: "pooja-app-4a4e4",
  storageBucket: "pooja-app-4a4e4.appspot.com",
  messagingSenderId: "423693630036",
  appId: "1:423693630036:web:879c3240c966b9a54ccbc1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

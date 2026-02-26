import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js';

const firebaseConfig = {
  apiKey: 'REPLACE_API_KEY',
  authDomain: 'REPLACE_PROJECT.firebaseapp.com',
  projectId: 'REPLACE_PROJECT',
  storageBucket: 'REPLACE_PROJECT.appspot.com',
  messagingSenderId: 'REPLACE_SENDER',
  appId: 'REPLACE_APP_ID'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

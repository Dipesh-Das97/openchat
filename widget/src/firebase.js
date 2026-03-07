import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onChildAdded, get, set, update, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC3QVqANPB2PruDDbwc9OQktvLNBMmtGt4",
  authDomain: "openchat-project.firebaseapp.com",
  databaseURL: "https://openchat-project-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "openchat-project",
};

let app;
let db;

export const initFirebase = () => {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
};

export const getDb = () => db;
export { ref, push, onChildAdded, get, set, onValue, update };
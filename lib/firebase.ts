import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBoVUgC5zAMu9yDZTUchiFqmHZ2vtc5GBg",
  authDomain: "adhyayan-backend.firebaseapp.com",
  projectId: "adhyayan-backend",
  storageBucket: "adhyayan-backend.firebasestorage.app",
  messagingSenderId: "574213834253",
  appId: "1:574213834253:web:fa9f6c2ecb4be878ebb744",
  measurementId: "G-YDCENMB6BD"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
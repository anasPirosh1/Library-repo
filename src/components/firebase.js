import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCR7AxlYsSkCBDnxNPlbsSVwx8WdgvagkQ",
  authDomain: "mantine-library.firebaseapp.com",
  projectId: "mantine-library",
  storageBucket: "mantine-library.appspot.com",
  messagingSenderId: "886753886779",
  appId: "1:886753886779:web:16da7eaf6bc5df5adb921e",
  measurementId: "G-CTGGEX6K1H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
export const storage = getStorage();

// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJ1wU3rRGWgThvgpzn_jkpWGe0ykXhxgA",
  authDomain: "green-bean-ceb39.firebaseapp.com",
  projectId: "green-bean-ceb39",
  storageBucket: "green-bean-ceb39.appspot.com",
  messagingSenderId: "125701844572",
  appId: "1:125701844572:web:8477b1fb8eae947c5d8099",
  measurementId: "G-V5X44Y1R60",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireStoredb = getFirestore(app); // Pass `app` to `getFirestore`

const uploadData = async () => {
  const data = {
    key1: "test1",
    key2: "test2",
  };

  // Specify the document path and set data
  const document = doc(fireStoredb, "testing", "unique-id-for-document");
  let dataUpdated = await setDoc(document, data); // Use `data` here
  return dataUpdated;
};

module.exports = {
  uploadData,
};

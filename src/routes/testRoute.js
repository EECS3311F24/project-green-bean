const express = require("express");
const router = express.Router();
const { doc, setDoc } = require("firebase/firestore");
const { fireStoredb } = require("../startup/db");

router.get("/", async (req, res) => {
  try {
    const data = {
      key1: "key2",
      key2: "key1",
    };
    const document = doc(fireStoredb, "testings", "unique-id-for-testing2");
    await setDoc(document, data);
    res.send("Data uploaded successfully to Firebase!");
  } catch (error) {
    console.error("Error uploading data to Firebase:", error);
    res.status(500).send("Failed to upload data to Firebase.");
  }
});

module.exports = router;

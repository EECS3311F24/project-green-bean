const express = require("express");
const router = express.Router();
const { doc, setDoc } = require("firebase/firestore");
const { fireStoredb } = require("../startup/db");

// List the booked arenas for the authenticated user
router.get("/", async (req, res) => {
  try {
  } catch {}
});

// Book a available arena
router.post("/", async (req, res) => {
  try {
  } catch {}
});

module.exports = router;

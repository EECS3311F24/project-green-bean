const express = require("express");
const router = express.Router();
const { doc, setDoc } = require("firebase/firestore");
const { fireStoredb } = require("../startup/db");

// Fetch a list of arenas
router.get("/", async (req, res) => {
  try {
  } catch {}
});

// Fetch a arena based of id
router.get("/:id", async (req, res) => {
  try {
  } catch {}
});

// Add a new Arena
router.post("/", async (req, res) => {
  try {
  } catch {}
});

module.exports = router;

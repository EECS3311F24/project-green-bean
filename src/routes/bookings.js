const express = require("express");
const router = express.Router();
const {
  doc,
  setDoc,
  collection,
  getDocs,
  getDoc,
  query,
  where,
} = require("firebase/firestore");
const { fireStoredb } = require("../startup/db");

// Fetch all the bookings
router.get("/", async (req, res) => {
  try {
    const bookingsRef = collection(fireStoredb, "bookings");
    const snapshot = await getDocs(bookingsRef);
    const bookings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch bookings", error: error.message });
  }
});

// Fetch booking by first and last name
router.get("/user", async (req, res) => {
  const { email } = req.query;

  try {
    const bookingsRef = collection(fireStoredb, "bookings");
    const q = query(bookingsRef, where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user" });
    }

    const bookings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch booking by email",
      error: error.message,
    });
  }
});

// Add a new booking
router.post("/", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      arenaName,
      email,
      date,
      time,
      isRepeat,
      paymentInfo,
      arenaId,
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !arenaName ||
      !email ||
      !date ||
      !time ||
      !arenaId
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Fetch the specified arena to check availability
    const arenaRef = doc(fireStoredb, "arenas", arenaId);
    const arenaSnap = await getDoc(arenaRef);

    // Check if the arena exists and is available
    if (
      !arenaSnap.exists() ||
      (arenaSnap.data().isBooked &&
        Object.keys(arenaSnap.data().isBooked).length > 0)
    ) {
      return res
        .status(400)
        .json({ message: "The specified arena is not available right now" });
    }

    // Create a new booking in Firestore
    const newBookingRef = doc(collection(fireStoredb, "bookings"));
    await setDoc(newBookingRef, {
      firstName,
      lastName,
      phoneNumber,
      arenaName,
      email,
      date,
      time,
      isRepeat: isRepeat || null,
      paymentInfo: paymentInfo || {},
      arenaId: arenaId,
    });

    res
      .status(201)
      .json({ message: "Booking created successfully", id: newBookingRef.id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create booking", error: error.message });
  }
});

router.post("/check", async (req, res) => {
  const { arenaId, date, time } = req.body;

  try {
    const bookingsRef = collection(fireStoredb, "bookings");
    const q = query(
      bookingsRef,
      where("arenaId", "==", arenaId),
      where("date", "==", date),
      where("time", "==", time)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return res.status(200).json({ available: false });
    }
    res.status(200).json({ available: true });
  } catch (err) {
    res.status(500).json({
      message: "Error checking availability.",
      error: err.message,
    });
  }
});

// Update booking time
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { time, date } = req.body;

  try {
    // Validate new time and date
    if (!time || !date) {
      return res.status(400).json({ message: "Date and time are required" });
    }

    // Check if the new time slot is available
    const bookingsRef = collection(fireStoredb, "bookings");
    const q = query(
      bookingsRef,
      where("arenaId", "==", req.body.arenaId),
      where("date", "==", req.body.date),
      where("time", "==", req.body.time)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return res.status(400).json({ message: "Time slot is not available" });
    }

    // Update the booking
    const bookingRef = doc(fireStoredb, "bookings", id);
    await setDoc(bookingRef, { time, date }, { merge: true });

    res.status(200).json({ message: "Booking time updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update booking time",
      error: error.message,
    });
  }
});

module.exports = router;

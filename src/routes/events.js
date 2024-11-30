const express = require("express");
const router = express.Router();

const multer = require("multer");
const store = multer.memoryStorage();
const upload = multer({storage:  store }); // Files stored in memory for quick access


const { ref, uploadBytes, getDownloadURL } = require("firebase/storage"); //access to firebase storage
const { collection, doc, setDoc, getDoc, getDocs,  query, where } = require("firebase/firestore"); //access to firestore data for retrieving
const { fireStoredb, fireStoreStorage } = require("../startup/db");

router.post("/testing", upload.single("image"), async (req, res, ) =>{
  try {
    const {
      firstName,
  } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).send("No file uploaded.");
    }
    console.log(file.originalname);

    // Define Firebase Storage reference
    const storageRef = ref(fireStoreStorage, `images/${file.originalname}`);

    // Upload the image to Firebase Storage
    await uploadBytes(storageRef, file.buffer);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log(downloadURL);

    // Create a new booking in Firestore
    const newBookingRef = doc(collection(fireStoredb, "testing"));

    await setDoc(newBookingRef, {
      firstName,
      eventImage : downloadURL
      
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

router.get("/", async (req, res) => {
  try {
    const eventsRef = collection(fireStoredb, "events");
    const snapshot = await getDocs(eventsRef);
    const events = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch events", error: error.message });
  }
});


router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const eventItem= doc(fireStoredb, "events", id);
    const snapshot = await getDoc(eventItem);
    if (snapshot.empty) {
      return res.status(404).json({ message: "No event is found" });
    }
    res.status(200).json({ id: snapshot.id, ...snapshot.data() });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch arenas", error: error.message });
  }

});

//make a new event
router.post("/booking", upload.single("image"), async(req, res, ) =>{
  try {
    const {
        firstName,
        lastName,
        phoneNumber,
        email,
        eventTitle,
        eventDescription,
        minAge,
        maxAge,
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
        !eventTitle ||
        !eventDescription ||
        !minAge ||
        !email ||
        !date ||
        !time ||
        !arenaId
      ) {
        return res
          .status(400)
          .json({ message: "Please provide all required fields" });
      }

    const file = req.file;

    if (!file) {
        return res.status(400).send("No file uploaded.");
    }

    // Define Firebase Storage reference
    const storageRef = ref(fireStoreStorage, `images/${file.originalname}`);

    // Upload the image to Firebase Storage
    await uploadBytes(storageRef, file.buffer);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

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
    const newBookingRef = doc(collection(fireStoredb, "events"));
    await setDoc(newBookingRef, {
      firstName,
      lastName,
      phoneNumber,
      email,
      eventTitle,
      eventDescription,
      eventImage : downloadURL,
      minAge,
      maxAge: maxAge || null,
      date,
      time,
      isRepeat: isRepeat || null,
      paymentInfo: paymentInfo || {},
      arenaId: arenaId,
    });

    // Update the arena with user booking information
    await setDoc(
      arenaRef,
      {
        isBooked: {
          firstName,
          lastName,
          bookingId: newBookingRef.id,
        },
      },
      { merge: true }
    ); // Use merge to keep existing arena data

    res
      .status(201)
      .json({ message: "Booking created successfully", id: newBookingRef.id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create booking", error: error.message });
  }

    

});

module.exports = router;
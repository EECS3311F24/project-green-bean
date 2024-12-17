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

//Fetch all feedback
router.get("/", async (req, res) => {
    try {
        const feedbackRef = collection(fireStoredb, "feedback");
        const snapshot = await getDocs(feedbackRef);
    
        if (snapshot.empty) {
          return res.status(404).json({ message: "No feedback found" });
        }
    
        const comments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(comments);
      } catch (error) {
        res.status(500).json({
          message: "Failed to fetch list of feedback",
          error: error.message,
        });
      }
});

//Fetch feedback based on arena id
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const feedbackRef = collection(fireStoredb, "feedback");
        const q = query(feedbackRef, where("arenaId", "==", id));
        const snapshot = await getDocs(q);
    
        if (snapshot.empty) {
          return res.status(404).json({ message: "No feedback found in this arena" });
        }
    
        const comments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(comments);
      } catch (error) {
        res.status(500).json({
          message: "Failed to fetch feedback by arenaId",
          error: error.message,
        });
      }
});

//add comment and rating for the arena
router.post("/", async (req, res) => {
    try{
        const {
            username,
            comment,
            rating,
            arenaId 
        } = req.body;
    
        // Validate required fields
        if (
            !username ||
            !comment ||
            !rating ||
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
        if (!arenaSnap.exists()) {
        return res
            .status(400)
            .json({ message: "The specified arena does not exist" });
        }

        // Create Feedback in Firestore
    const newFeedbackRef = doc(collection(fireStoredb, "feedback"));
    await setDoc(newFeedbackRef, {
        username,
        comment,
        rating: rating || 0,
        arenaId : arenaId, 
    });

     // Fetch all feedback for the arena to calculate average rating
     const feedbackRef = collection(fireStoredb, "feedback");
     const q = query(feedbackRef, where("arenaId", "==", arenaId));
     const feedbackSnapshot = await getDocs(q);
 
     let totalRating = 0;
     let feedbackCount = 0;
 
     feedbackSnapshot.forEach((doc) => {
       const data = doc.data();
       totalRating += data.rating;
       feedbackCount++;
     });
 
     // Calculate average rating
     const avgRating = feedbackCount > 0 ? totalRating / feedbackCount : 0;
 
     // Update the arena's average rating
     await setDoc(arenaRef, { rating: avgRating }, { merge: true });
     
      // Emit a Socket.IO event to notify clients of new feedback
      const io = req.app.get("socketio");
      io.emit("newFeedback", { id: newFeedbackRef.id});
      res.status(201)
      .json({ message: "Feedback created successfully", id: newFeedbackRef.id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create feedback", error: error.message });
  }
});

module.exports = router;
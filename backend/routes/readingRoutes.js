const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addReading,
    getReadings,
    updateReading,
    deleteReading
} = require("../controllers/readingController");

// Add a new reading
router.post("/", protect, addReading);

// View all readings
router.get("/", protect, getReadings);

// Edit a reading
router.put("/:id", protect, updateReading);

// Delete a reading
router.delete("/:id", protect, deleteReading);

module.exports = router;
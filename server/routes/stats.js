const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Event = require("../models/event");


// נתיב סטטיסטיקות
router.get("/stats", async (req, res) => {
  try {
    const total = await Event.countDocuments();
    const confirmed = await Event.countDocuments({ status: "confirmed" });
    const dismissed = await Event.countDocuments({ status: "dismissed" });

    res.json({
      totalEvents: total,
      confirmedEvents: confirmed,
      dismissedEvents: dismissed
    });
  } catch (err) {
    console.error(" Error fetching stats:", err);
    res.status(500).json({ message: "Error fetching statistics" });
  }
});

module.exports = router;
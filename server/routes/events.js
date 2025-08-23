const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const Camera = require("../models/camera");
const axios = require("axios");

/**
 * GET /events
 */
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ timestamp: -1 });
    res.json(events.map(e => ({
      ...e.toObject(),
      id: e._id
    })));
  } catch (err) {
    console.error("Failed to fetch events:", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

/**
 * POST /events
 * Creates a new event in the database with the given details:
 * - type: type of anomaly (string)
 * - imageUrl: URL of the anomaly image
 * - status: optional, defaults to "pending"
 * - timestamp: event time
 * - cameraLocation: where the camera is located
 */
router.post("/events", async (req, res) => {
  try {
    const { type, imageUrl, status, timestamp, cameraLocation } = req.body;
    console.log("Received POST body:", req.body);

    const event = await Event.create({
      type,
      imageUrl,
      status: status || "pending",
      timestamp,
      cameraLocation
    });

    res.status(201).json({
      ...event.toObject(),
      id: event._id
    });
  } catch (err) {
    console.error("Failed to save event:", err);
    res.status(500).json({ message: "Error saving event" });
  }
});

/**
 * PUT /events/:id
 * Updates an existing event (mainly its status).
 * After updating, sends a POST request to the Flask server
 * to release the anomaly lock so new alerts can be triggered.
 */
router.put("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Event.findByIdAndUpdate(id, { status }, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Notify Flask to release the anomaly detection lock
    try {
      await axios.post("http://localhost:5000/release_alert");
      console.log("Alert lock released in Flask");
    } catch (flaskErr) {
      console.error("Failed to notify Flask to release alert:", flaskErr.message);
    }

    res.json({
      ...updated.toObject(),
      id: updated._id
    });
  } catch (err) {
    console.error("Failed to update event:", err);
    res.status(500).json({ message: "Failed to update event" });
  }
});

/**
 * GET /stats
 * Returns system statistics:
 * - confirmed: number of confirmed events
 * - dismissed: number of dismissed events
 * - totalCameras: number of cameras in the system
 */
router.get("/stats", async (req, res) => {
  try {
    const confirmed = await Event.countDocuments({ status: "confirmed" });
    const dismissed = await Event.countDocuments({ status: "dismissed" });
    const totalCameras = await Camera.countDocuments();

    res.json({ confirmed, dismissed, totalCameras });
  } catch (err) {
    res.status(500).json({ message: "Failed to get stats" });
  }
});

module.exports = router;

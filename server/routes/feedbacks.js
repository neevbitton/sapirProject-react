const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedback");

router.post("/feedbacks", async (req, res) => {
    try {
        const {
            eventId,
            feedback
        } = req.body;
        const saved = await Feedback.create({
            eventId,
            feedback
        });
        res.status(201).json(saved);
    } catch (err) {
        console.error("Failed to save feedback:", err);
        res.status(500).json({
            message: "Error saving feedback"
        });
    }
});

module.exports = router;
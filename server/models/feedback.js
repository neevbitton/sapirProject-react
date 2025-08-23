const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  feedback: { type: String, enum: ["confirmed", "dismissed"], required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", feedbackSchema);
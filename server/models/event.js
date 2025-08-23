const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  type: String,
  imageUrl: String,
  status: {
    type: String,
    default: "pending"
  },
  timestamp: Date,
  cameraLocation: String,
});

module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);
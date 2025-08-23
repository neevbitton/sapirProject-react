const mongoose = require("mongoose");

const cameraSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  feedUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

module.exports = mongoose.model("Camera", cameraSchema);
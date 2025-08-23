const express = require("express");
const http = require("http");
const { Server } = require("socket.io"); // Import Socket.IO server
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();

// Serve static files for anomaly images
app.use("/anomalies", express.static(path.join(__dirname, "..", "public", "anomalies")));

// Import routes
const eventRoutes = require("./routes/events");
const cameraRoutes = require("./routes/cameras");
const statsRoutes = require("./routes/stats");
const authRoutes = require("./routes/auth");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/anomaly_feedback", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Express middleware
app.use(cors());
app.use(express.json());

// Register API routes
app.use("/api", authRoutes);
app.use("/api", eventRoutes);
app.use("/api", cameraRoutes);
app.use("/api", statsRoutes);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Model for saving feedback in MongoDB
const Feedback = require("./models/feedback");

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log(" Client connected");

  // Listen for user feedback and save it to MongoDB
  socket.on("userFeedback", async (data) => {
    try {
      await Feedback.create(data);
      console.log(" Feedback saved:", data);
    } catch (err) {
      console.error(" Error saving feedback:", err);
    }
  });

 
});

// Feedback-related routes
const feedbackRoutes = require("./routes/feedbacks");
app.use("/api", feedbackRoutes);

// Start the server
server.listen(4001, () =>
  console.log(" Server running on http://localhost:4001")
);

// Export Socket.IO instance for use in other modules (e.g., events.js)
module.exports = io;

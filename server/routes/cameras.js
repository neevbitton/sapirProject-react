const express = require('express');
const router = express.Router();
const Camera = require('../models/camera');

// Add new camera
router.post('/cameras', async (req, res) => {
  try {
    const { location, feedUrl } = req.body;
    const camera = await Camera.create({ location, feedUrl, status: 'active' });
    res.json(camera);
  } catch (err) {
    res.status(500).json({ message: 'Error saving camera' });
  }
});

// Get all cameras
router.get('/cameras', async (req, res) => {
  try {
    const cameras = await Camera.find();
    res.json(cameras);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cameras' });
  }
});

module.exports = router;
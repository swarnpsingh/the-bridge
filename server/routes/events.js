const express = require('express');
const Event = require('../models/Event');

const router = express.Router();

router.get('/', async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  res.json(events);
});

router.post('/', async (req, res) => {
  try {
    const event = new Event({ ...req.body, approved: false });
    await event.save();
    res.status(201).json({ msg: 'Submitted for review', event });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
const express = require('express');
const Event = require('../models/Event');

const router = express.Router();

router.get('/', async (req, res) => {
  const events = await Event.find({ approved: true }).sort({ createdAt: -1 });
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

router.post('/:id/rsvp', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found.' });

    const alreadyRsvped = event.rsvps.some(
      r => r.email.toLowerCase() === email.toLowerCase()
    );
    if (!alreadyRsvped) {
      event.rsvps.push({ name, email });
      await event.save();
    }
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Member  = require('../models/Member');
const Event   = require('../models/Event');
const Service = require('../models/Service');

// ── Auth middleware ──────────────────────────────────────────
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

// ── Login ────────────────────────────────────────────────────
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) return res.status(401).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

// ── Members ──────────────────────────────────────────────────
router.get('/members', protect, async (req, res) => {
  const members = await Member.find().sort({ createdAt: -1 });
  res.json(members);
});

router.delete('/members/:id', protect, async (req, res) => {
  await Member.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Member removed' });
});

// ── Events ───────────────────────────────────────────────────
router.get('/events', protect, async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  res.json(events);
});

router.post('/events', protect, async (req, res) => {
  const event = new Event({ ...req.body, approved: true }); // admin-created = auto approved
  await event.save();
  res.status(201).json(event);
});

router.patch('/events/:id/approve', protect, async (req, res) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id, { approved: true }, { new: true }
  );
  res.json(event);
});

router.delete('/events/:id', protect, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Event deleted' });
});

// ── Services ─────────────────────────────────────────────────
router.get('/services', protect, async (req, res) => {
  const services = await Service.find()
    .populate('postedBy', 'name')
    .sort({ createdAt: -1 });
  res.json(services);
});

router.delete('/services/:id', protect, async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Service removed' });
});

module.exports = router;    
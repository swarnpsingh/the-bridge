const router = require('express').Router();
const Member = require('../models/Member');

// GET /api/members?type=Founder&role=Mentor
router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.type) filter.memberType = req.query.type;
  if (req.query.role) filter.platformRole = req.query.role;
  const members = await Member.find(filter).sort({ createdAt: -1 });
  res.json(members);
});

// GET /api/members/:id
router.get('/:id', async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) return res.status(404).json({ msg: 'Not found' });
  res.json(member);
});

// POST /api/members
router.post('/', async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/members/:id
router.put('/:id', async (req, res) => {
  try {
    const { password, ...rest } = req.body; // never update password here
    const member = await Member.findByIdAndUpdate(
      req.params.id, rest, { new: true }
    ).select('-password');
    if (!member) return res.status(404).json({ msg: 'Not found' });
    res.json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
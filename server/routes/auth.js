const router = require('express').Router();
const fs = require('fs');
const jwt    = require('jsonwebtoken');
const Member = require('../models/Member');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const msg = `POST /api/auth/register called - body: ${JSON.stringify(req.body)}\n`;
  console.log(msg);
  try { fs.appendFileSync('/tmp/the-bridge-debug.log', msg); } catch (e) {}
  const { name, email, password, memberType, platformRole,
          linkedin, location, company, role, bio } = req.body;
  try {
    const exists = await Member.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });

    const member = await Member.create({
      name, email, password, memberType, platformRole,
      linkedin, location, company, role, bio,
    });

    res.status(201).json({
      token: generateToken(member._id),
      member: {
        _id: member._id, name: member.name, email: member.email,
        memberType: member.memberType, platformRole: member.platformRole,
        linkedin: member.linkedin, location: member.location,
        company: member.company, role: member.role, bio: member.bio,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    try { fs.appendFileSync('/tmp/the-bridge-debug.log', `Register error: ${err.stack || err}\n`); } catch (e) {}
    res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const member = await Member.findOne({ email });
    if (!member) return res.status(401).json({ error: 'Invalid email or password' });

    const match = await member.matchPassword(password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    res.json({
      token: generateToken(member._id),
      member: {
        _id: member._id, name: member.name, email: member.email,
        memberType: member.memberType, platformRole: member.platformRole,
        linkedin: member.linkedin, location: member.location,
        company: member.company, role: member.role, bio: member.bio,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
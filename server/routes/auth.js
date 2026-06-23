const router = require('express').Router();
const fs = require('fs');
const jwt       = require('jsonwebtoken');
const Member    = require('../models/Member');
const sendEmail = require('../utils/sendEmail');

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

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const member = await Member.findOne({ email });
    if (!member) return res.status(404).json({ error: 'No account found with that email' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    member.resetOtp = otp;
    member.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await member.save();

    await sendEmail({
      to: email,
      subject: 'Your Bridge password reset code',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f8fbff;border-radius:16px">
          <h2 style="text-align:center;color:#0f172a;font-size:20px;font-weight:700;margin-bottom:8px">Reset your password</h2>
          <p style="color:#55627a;font-size:14px;text-align:center;margin-bottom:28px">
            Use the code below to reset your Bridge account password.<br/>It expires in <strong>10 minutes</strong>.
          </p>
          <div style="background:#fff;border:2px solid #2563eb;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
            <div style="font-size:36px;font-weight:900;letter-spacing:12px;color:#2563eb">${otp}</div>
          </div>
          <p style="color:#8290a8;font-size:12px;text-align:center">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: 'OTP sent' });
  } catch (err) {
    console.error('forgot-password error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const member = await Member.findOne({
      email,
      resetOtp: otp,
      resetOtpExpires: { $gt: Date.now() },
    });
    if (!member) return res.status(400).json({ error: 'Invalid or expired OTP' });

    member.password = newPassword;
    member.resetOtp = undefined;
    member.resetOtpExpires = undefined;
    await member.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
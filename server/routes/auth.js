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
  const { name, password, memberType, platformRole,
          linkedin, location, company, role, bio,
          phone, promotionsOptIn } = req.body;
  const email = req.body.email?.toLowerCase().trim();
  try {
    const exists = await Member.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });

    const member = await Member.create({
      name, email, password, memberType, platformRole,
      linkedin, location, company, role, bio,
      phone, promotionsOptIn,
    });

    sendEmail({
      to: email,
      subject: 'Welcome to The Bridge!',
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#f8fbff;border-radius:16px">
          <div style="text-align:center;margin-bottom:24px">
            <img src="https://bridgemakersmn.org/bridgemakersLogo.png" alt="Bridgemakers" style="width:56px;height:56px;object-fit:contain" />
          </div>
          <h2 style="text-align:center;color:#0f172a;font-size:22px;font-weight:800;margin-bottom:8px;letter-spacing:-0.5px">
            Welcome to The Bridge, ${name}!
          </h2>
          <p style="color:#55627a;font-size:14px;text-align:center;margin-bottom:32px;line-height:1.7">
            You're now part of a growing community of young leaders — founders, developers, mentors, and more.<br/>Here's how to make the most of it.
          </p>

          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px 24px;margin-bottom:12px">
            <div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:4px">👥 Connect with people of interest</div>
            <div style="font-size:13px;color:#64748b;line-height:1.6;margin-bottom:10px">Browse the member directory and reach out to founders, developers, mentors, and more who share your interests.</div>
            <a href="https://bridgemakersmn.org/dashboard/members" style="font-size:12px;font-weight:600;color:#2563eb;text-decoration:none">Browse members →</a>
          </div>

          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px 24px;margin-bottom:12px">
            <div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:4px">⇄ Post an Exchange</div>
            <div style="font-size:13px;color:#64748b;line-height:1.6;margin-bottom:10px">Offer a skill or ask for help. Exchanges are a great way to collaborate and give back to the community.</div>
            <a href="https://bridgemakersmn.org/dashboard/exchanges" style="font-size:12px;font-weight:600;color:#db2777;text-decoration:none">Post an exchange →</a>
          </div>

          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px 24px;margin-bottom:32px">
            <div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:4px">💬 Share your feedback</div>
            <div style="font-size:13px;color:#64748b;line-height:1.6;margin-bottom:10px">We're always improving. Let us know what you love, what's missing, or how we can make The Bridge better for you.</div>
            <a href="https://thebridge.userjot.com/" style="font-size:12px;font-weight:600;color:#059669;text-decoration:none">Give feedback →</a>
          </div>

          <div style="text-align:center">
            <a href="https://bridgemakersmn.org/dashboard" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;font-size:14px;font-weight:700;border-radius:12px;text-decoration:none">
              Go to your dashboard →
            </a>
          </div>

          <p style="color:#8290a8;font-size:12px;text-align:center;margin-top:32px;line-height:1.7">
            Questions? Reach us at <a href="mailto:admin@bridgemakersmn.org" style="color:#2563eb;text-decoration:none">admin@bridgemakersmn.org</a>
          </p>
        </div>
      `,
    }).catch(err => console.error('Welcome email failed:', err));

    res.status(201).json({
      token: generateToken(member._id),
      member: {
        _id: member._id, name: member.name, email: member.email,
        memberType: member.memberType, platformRole: member.platformRole,
        linkedin: member.linkedin, location: member.location,
        company: member.company, role: member.role, bio: member.bio,
        phone: member.phone, showPhone: member.showPhone,
        promotionsOptIn: member.promotionsOptIn,
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
  const email = req.body.email?.toLowerCase().trim();
  const { password } = req.body;
  try {
    const member = await Member.findOne({ email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } });
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
        phone: member.phone, showPhone: member.showPhone,
        promotionsOptIn: member.promotionsOptIn,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const email = req.body.email?.toLowerCase().trim();
  try {
    const member = await Member.findOne({ email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } });
    if (!member) return res.status(404).json({ error: 'No account found with that email' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Member.updateOne(
      { _id: member._id },
      { resetOtp: otp, resetOtpExpires: new Date(Date.now() + 10 * 60 * 1000) }
    );

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
  const email = req.body.email?.toLowerCase().trim();
  const { otp, newPassword } = req.body;
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
    await member.save({ validateBeforeSave: false });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
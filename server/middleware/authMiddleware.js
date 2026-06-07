const jwt    = require('jsonwebtoken');
const Member = require('../models/Member');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Not authorised' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.member = await Member.findById(decoded.id).select('-password');
    next();
  } catch {
    res.status(401).json({ error: 'Token invalid or expired' });
  }
};
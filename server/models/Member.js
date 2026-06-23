const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const MemberSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  password:     { type: String, required: true },
  linkedin:     { type: String },
  location:     { type: String },
  company:      { type: String },
  role:         { type: String },
  memberType:   {
    type: [String],
    enum: ['Founder','Entrepreneur','Software developer','Marketing','Content creator','Student','Artist','Musician','Creative','Organizer','Activist','Policy professional','AI','Other'],
    validate: { validator: arr => arr.length > 0, message: 'At least one member tag is required.' },
  },
  platformRole: { type: String, enum: ['Member','Mentor'], default: 'Member' },
  bio:          { type: String },
  photo:        { type: String },
  resetOtp:        { type: String },
  resetOtpExpires: { type: Date },
}, { timestamps: true });

// Hash password before saving
MemberSchema.pre('save', async function() {
  const preMsg = `Member pre-save hook: isModified(password)= ${this.isModified('password')}\n`;
  console.log(preMsg);
  try { require('fs').appendFileSync('/tmp/the-bridge-debug.log', preMsg); } catch (e) {}
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password helper
MemberSchema.methods.matchPassword = async function(entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('Member', MemberSchema);
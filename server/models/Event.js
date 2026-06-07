const mongoose = require("mongoose");
const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    time: { type: String },
    format: { type: String, enum: ["Online", "In-person"], default: "In-person", required: true },
    location: { type: String },
    host: { type: String },
    rsvps: [{ name: String, email: String }],
    approved: { type: Boolean, default: false },
    submittedBy: { name: String, email: String },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Event", EventSchema);

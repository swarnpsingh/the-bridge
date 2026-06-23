const mongoose = require("mongoose");
const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: ["Partnership","Marketing","Design","Content","Website","Software","Business development","Introduction","Events","Work opportunity","Other"],
      required: true,
    },
    type: { type: String, enum: ["Offered", "Requested"], required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Service", ServiceSchema);

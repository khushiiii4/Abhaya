const mongoose = require("mongoose");

const sosLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    contactsNotified: [
      {
        name: String,
        phone: String,
        smsStatus: String  // "sent", "failed"
      }
    ],
    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SOSLog", sosLogSchema);

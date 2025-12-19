const mongoose = require("mongoose");

const safeZoneSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    radius: {
      type: Number,
      required: true,
      default: 1000, // in meters
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SafeZone", safeZoneSchema);

const SafeZone = require("../models/SafeZone");

// GET /api/zones - Get all safe zones for user
const getZones = async (req, res) => {
  try {
    const zones = await SafeZone.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(zones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/zones - Create new safe zone
const createZone = async (req, res) => {
  try {
    const { name, description, location, radius } = req.body;

    if (!name || !location || !location.lat || !location.lng) {
      return res.status(400).json({ message: "Name and location required" });
    }

    const newZone = await SafeZone.create({
      userId: req.user._id,
      name,
      description: description || "",
      location,
      radius: radius || 1000,
    });

    res.status(201).json(newZone);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/zones/:id - Delete safe zone
const deleteZone = async (req, res) => {
  try {
    const zone = await SafeZone.findById(req.params.id);

    if (!zone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    if (zone.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await zone.deleteOne();

    res.json({ message: "Zone removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getZones,
  createZone,
  deleteZone,
};

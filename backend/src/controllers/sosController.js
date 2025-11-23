const SOSLog = require("../models/SOSLog");
const Contact = require("../models/Contact");
const { sendSMS } = require("../services/twilioService");


// POST /api/sos/trigger
const triggerSOS = async (req, res) => {
  try {
    const user = req.user;
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Location required" });
    }

    // Fetch user's saved contacts
    const contacts = await Contact.find({ userId: user._id });

    // Prepare message
    const sosMessage = `🚨 SOS Alert!\n${user.name} is in danger.\nLocation: https://www.google.com/maps?q=${lat},${lng}`;

    const notifiedContacts = [];

    // Send SMS to each contact
    for (let c of contacts) {
      try {
        await sendSMS(`+91${c.phone}`, sosMessage);

        notifiedContacts.push({
          name: c.name,
          phone: c.phone,
          smsStatus: "sent"
        });

      } catch (err) {
        notifiedContacts.push({
          name: c.name,
          phone: c.phone,
          smsStatus: "failed"
        });
      }
    }

    // Create SOS log in DB
    const sosLog = await SOSLog.create({
      userId: user._id,
      location: { lat, lng },
      contactsNotified: notifiedContacts
    });

    // Emit socket alert to connected clients
    req.app.get("io").emit("sos:alert", {
      userId: user._id,
      userName: user.name,
      lat,
      lng,
      message: `${user.name} has triggered SOS`
    });

    res.status(201).json({
      success: true,
      message: "SOS triggered",
      sosId: sosLog._id,
      contactsNotified
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "SOS trigger failed" });
  }
};


// POST /api/sos/resolve
const resolveSOS = async (req, res) => {
  try {
    const { sosId } = req.body;

    if (!sosId) {
      return res.status(400).json({ message: "sosId required" });
    }

    const sosLog = await SOSLog.findById(sosId);

    if (!sosLog) {
      return res.status(404).json({ message: "SOS not found" });
    }

    // Only owner can resolve:
    if (sosLog.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    sosLog.status = "resolved";
    await sosLog.save();

    res.json({
      success: true,
      message: "SOS resolved"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to resolve SOS" });
  }
};

module.exports = { triggerSOS, resolveSOS };

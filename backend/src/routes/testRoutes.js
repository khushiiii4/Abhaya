const express = require("express");
const router = express.Router();
const { sendTestSMS } = require("../services/twilioService");
const { protect } = require("../middleware/authMiddleware");

// POST /api/test/sms
// Body: { "phone": "+91XXXXXXXXXX" }
router.post("/sms", protect, async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    await sendTestSMS(phone);

    res.json({ success: true, message: "Test SMS sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send SMS" });
  }
});

module.exports = router;

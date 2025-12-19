const express = require("express");
const router = express.Router();

const { triggerSOS, resolveSOS, getSOSLogs } = require("../controllers/sosController");
const { protect } = require("../middleware/authMiddleware");

router.post("/trigger", protect, triggerSOS);
router.post("/resolve", protect, resolveSOS);
router.get("/logs", protect, getSOSLogs);

module.exports = router;

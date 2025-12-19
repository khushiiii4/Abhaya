const express = require("express");
const router = express.Router();

const { getZones, createZone, deleteZone } = require("../controllers/zoneController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getZones);
router.post("/", protect, createZone);
router.delete("/:id", protect, deleteZone);

module.exports = router;

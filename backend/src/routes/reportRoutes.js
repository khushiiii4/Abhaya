const express = require("express");
const router = express.Router();

const { 
  getReports, 
  getNearbyReports, 
  createReport, 
  deleteReport 
} = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getReports);
router.get("/nearby", protect, getNearbyReports);
router.post("/", protect, createReport);
router.delete("/:id", protect, deleteReport);

module.exports = router;

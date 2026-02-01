const express = require("express");
const router = express.Router();

const { 
  getReports, 
  getNearbyReports, 
  createReport, 
  updateReport,
  deleteReport 
} = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getReports);
router.get("/nearby", protect, getNearbyReports);
router.post("/", protect, createReport);
router.put("/:id", protect, updateReport);
router.delete("/:id", protect, deleteReport);

module.exports = router;

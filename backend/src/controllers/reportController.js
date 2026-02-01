const Report = require("../models/Report");

// GET /api/reports - Get all reports for user
const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/reports/nearby - Get all reports in area (for community view)
const getNearbyReports = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    // For now, return all active reports
    // TODO: Add geo-spatial queries for actual nearby filtering using lat/lng
    const reports = await Report.find({ status: "active" })
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/reports - Create new danger report
const createReport = async (req, res) => {
  try {
    const { category, description, location, severity } = req.body;

    if (!category || !description || !location || !location.lat || !location.lng) {
      return res.status(400).json({ 
        message: "Category, description, and location required" 
      });
    }

    const newReport = await Report.create({
      userId: req.user._id,
      category,
      description,
      location,
      severity: severity || "medium",
    });

    // Populate user info before sending response
    await newReport.populate("userId", "name");

    res.status(201).json(newReport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/reports/:id - Delete danger report
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (report.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await report.deleteOne();

    res.json({ message: "Report removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/reports/:id - Update danger report
const updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (report.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { category, description, severity, status } = req.body;

    if (category) report.category = category;
    if (description) report.description = description;
    if (severity) report.severity = severity;
    if (status) report.status = status;

    const updatedReport = await report.save();
    await updatedReport.populate("userId", "name");

    res.json(updatedReport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getReports,
  getNearbyReports,
  createReport,
  updateReport,
  deleteReport,
};

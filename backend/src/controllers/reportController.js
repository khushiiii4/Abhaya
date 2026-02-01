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
    const { lat, lng, radiusKm } = req.query;

    const reports = await Report.find({ status: "active" })
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .limit(100);

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const radius = Number.isFinite(parseFloat(radiusKm)) ? parseFloat(radiusKm) : 1;

    if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) {
      return res.json(reports);
    }

    const toRad = (value) => (value * Math.PI) / 180;
    const distanceKm = (aLat, aLng, bLat, bLng) => {
      const R = 6371;
      const dLat = toRad(bLat - aLat);
      const dLng = toRad(bLng - aLng);
      const sLat = toRad(aLat);
      const sLat2 = toRad(bLat);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(sLat) * Math.cos(sLat2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const filtered = reports.filter((report) => {
      const rLat = report.location?.lat;
      const rLng = report.location?.lng;
      if (!Number.isFinite(rLat) || !Number.isFinite(rLng)) return false;
      return distanceKm(latNum, lngNum, rLat, rLng) <= radius;
    });

    res.json(filtered);
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

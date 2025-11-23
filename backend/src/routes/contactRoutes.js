const express = require("express");
const router = express.Router();
const {
  getContacts,
  addContact,
  deleteContact,
} = require("../controllers/contactController");

const { protect } = require("../middleware/authMiddleware");

// Protected routes
router.get("/", protect, getContacts);
router.post("/", protect, addContact);
router.delete("/:id", protect, deleteContact);

module.exports = router;

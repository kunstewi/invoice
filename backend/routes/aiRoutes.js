const express = require("express");
const {
    generateDescription,
    suggestItems,
} = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All routes are protected
router.post("/generate-description", protect, generateDescription);
router.post("/suggest-items", protect, suggestItems);

module.exports = router;

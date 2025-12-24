const express = require("express");
const {
    getProfile,
    updateProfile,
    uploadProfilePicture,
    changePassword,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// All routes are protected
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/profile-picture", protect, upload.single("profilePicture"), uploadProfilePicture);
router.put("/change-password", protect, changePassword);

module.exports = router;

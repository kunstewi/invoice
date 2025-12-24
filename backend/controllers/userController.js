const User = require("../models/User");
const bcrypt = require("bcryptjs");
const path = require("path");

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                businessName: user.businessName,
                businessAddress: user.businessAddress,
                phone: user.phone,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Update fields
        user.name = req.body.name || user.name;
        user.businessName = req.body.businessName || user.businessName;
        user.businessAddress = req.body.businessAddress || user.businessAddress;
        user.phone = req.body.phone || user.phone;

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            data: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                profilePicture: updatedUser.profilePicture,
                businessName: updatedUser.businessName,
                businessAddress: updatedUser.businessAddress,
                phone: updatedUser.phone,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload profile picture
// @route   POST /api/users/profile-picture
// @access  Private
const uploadProfilePicture = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a file",
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Update profile picture path
        user.profilePicture = `/uploads/${req.file.filename}`;
        await user.save();

        res.status(200).json({
            success: true,
            data: {
                profilePicture: user.profilePicture,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide current and new password",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters",
            });
        }

        const user = await User.findById(req.user._id).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check current password
        const isPasswordMatch = await user.comparePassword(currentPassword);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    updateProfile,
    uploadProfilePicture,
    changePassword,
};

const User = require('../models/User');
const Client = require('../models/Client');

// @desc    Get current user
// @route   GET /api/users/me
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user settings
// @route   PUT /api/users/settings
exports.updateSettings = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { settings: req.body },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Change password
// @route   PUT /api/users/changepassword
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Change email
// @route   PUT /api/users/changeemail
exports.changeEmail = async (req, res) => {
    console.log('Change email request received');

    try {
        const { newEmail, password } = req.body;

        // Basic validation
        if (!newEmail || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide new email and password'
            });
        }

        // Find user
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if it's a Google user
        if (user.googleId && !user.password) {
            return res.status(400).json({
                success: false,
                message: 'Google users must change email through their Google account'
            });
        }

        // Verify password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Check if email is different
        if (user.email.toLowerCase() === newEmail.toLowerCase()) {
            return res.status(400).json({
                success: false,
                message: 'New email must be different from current email'
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({
            email: newEmail.toLowerCase()
        });

        if (existingUser && existingUser._id.toString() !== user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Email already in use'
            });
        }

        // Update email
        user.email = newEmail.toLowerCase().trim();
        await user.save(); // This will trigger the pre-save middleware

        console.log('Email updated successfully for user:', user._id);

        res.json({
            success: true,
            message: 'Email updated successfully'
        });

    } catch (error) {
        console.error('Change email error:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already in use'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while changing email'
        });
    }
};

// @desc    Admin: Get all users
// @route   GET /api/users/admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin: Delete user
// @route   DELETE /api/users/admin/:id
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete all clients associated with this user
        await Client.deleteMany({ tailorId: user._id });

        // Delete the user
        await user.remove();

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin: Get dashboard stats
// @route   GET /api/users/admin/stats
exports.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalClients = await Client.countDocuments();

        res.json({
            totalUsers,
            totalClients
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
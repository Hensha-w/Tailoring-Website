// backend/src/controllers/auth.controller.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, businessName } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            businessName,
            verificationToken,
            trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        // Generate JWT
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                subscription: user.subscription,
                trialEndsAt: user.trialEndsAt
            },
            message: 'Registration successful. Please check your email for verification.'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.googleAuth = async (req, res) => {
    try {
        const { tokenId } = req.body;
        // Verify Google token and create/authenticate user
        // Implement Google OAuth logic
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add other auth methods: login, forgotPassword, resetPassword, verifyEmail
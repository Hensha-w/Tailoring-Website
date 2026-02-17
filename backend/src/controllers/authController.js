const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const { sendEmail } = require('../utils/emailService');
const crypto = require('crypto');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        // Send welcome email with trial info
        await sendEmail({
            email: user.email,
            subject: 'Welcome to Tailoring Website',
            html: `
        <h1>Welcome ${user.name}!</h1>
        <p>Thank you for signing up. You have a 30-day free trial period.</p>
        <p>After your trial ends, a monthly subscription of ₦1500 will apply.</p>
      `
        });

        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                subscription: user.subscription
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordMatch = await user.matchPassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            success: true,
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                subscription: user.subscription,
                settings: user.settings
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Google login
// @route   POST /api/auth/google
exports.googleLogin = async (req, res) => {
    try {
        const { tokenId } = req.body;

        const response = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const { email_verified, name, email } = response.payload;

        if (!email_verified) {
            return res.status(400).json({ message: 'Email not verified' });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                googleId: response.payload.sub,
                password: crypto.randomBytes(20).toString('hex')
            });
        }

        res.json({
            success: true,
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                subscription: user.subscription,
                settings: user.settings
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email address'
            });
        }

        console.log('🔍 Processing forgot password for:', email);

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'If an account exists with this email, a reset link has been sent.'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        // This is line 173 - make sure it's just 'await user.save()'
        await user.save(); // No 'next' here!

        console.log('✅ Reset token generated for user:', user.email);

        // Rest of your code...

    } catch (error) {
        console.error('❌ Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Could not send reset email. Please try again.'
        });
    }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resetToken
exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resetToken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
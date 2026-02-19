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

        // Send welcome email
        await sendEmail({
            email: user.email,
            subject: 'Welcome to TailorPro',
            html: `
                <h1>Welcome ${user.name}!</h1>
                <p>Thank you for signing up. You have a 7-day free trial period.</p>
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
                subscription: user.subscription,
                settings: user.settings
            }
        });
    } catch (error) {
        console.error('Register error:', error);
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
        console.error('Login error:', error);
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
        console.error('Google login error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        console.log('🔍 Processing forgot password for:', email);

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email address'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ User not found with email:', email);
            // Always return success for security (don't reveal if email exists)
            return res.status(200).json({
                success: true,
                message: 'If an account exists with this email, a password reset link will be sent.'
            });
        }

        console.log('✅ User found:', user.email);

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire (10 minutes)
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        console.log('🔐 Saving user with reset token...');

        // Save the user
        await user.save();
        console.log('✅ User saved successfully with reset token');

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/resetpassword/${resetToken}`;

        console.log('🔗 Reset URL created:', resetUrl);

        // Send email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Request - TailorPro',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                            .button { 
                                display: inline-block; 
                                padding: 12px 24px; 
                                background: #10b981; 
                                color: white; 
                                text-decoration: none; 
                                border-radius: 5px;
                                margin: 20px 0;
                            }
                            .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Password Reset Request</h1>
                            </div>
                            <div class="content">
                                <p>Hello ${user.name},</p>
                                <p>You recently requested to reset your password for your TailorPro account. Click the button below to reset it:</p>
                                
                                <div style="text-align: center;">
                                    <a href="${resetUrl}" class="button">Reset Password</a>
                                </div>
                                
                                <p>Or copy and paste this link into your browser:</p>
                                <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">
                                    ${resetUrl}
                                </p>
                                
                                <p>This password reset link will expire in <strong>10 minutes</strong>.</p>
                                
                                <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                            </div>
                            <div class="footer">
                                <p>&copy; ${new Date().getFullYear()} TailorPro. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            });

            console.log('✅ Reset email sent successfully to:', user.email);
        } catch (emailError) {
            console.error('❌ Error sending email:', emailError);

            // If email fails, clean up the reset token
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            return res.status(500).json({
                success: false,
                message: 'Error sending reset email. Please try again.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Password reset email sent successfully'
        });

    } catch (error) {
        console.error('❌ Forgot password error:', error);

        // If there's an error, try to clean up any partial changes
        try {
            const user = await User.findOne({ email: req.body.email });
            if (user && user.resetPasswordToken) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpire = undefined;
                await user.save();
            }
        } catch (cleanupError) {
            console.error('❌ Cleanup error:', cleanupError);
        }

        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred. Please try again.'
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

        console.log('🔍 Processing reset password with token hash:', resetPasswordToken);

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            console.log('❌ Invalid or expired token');
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        console.log('✅ User found, setting new password');

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        console.log('✅ Password reset successful for user:', user.email);

        res.json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        console.error('❌ Reset password error:', error);
        res.status(500).json({ message: error.message });
    }
};
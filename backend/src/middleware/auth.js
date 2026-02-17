const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized to access this route' });
    }
};

exports.admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Admin access only' });
    }
};

// New middleware to check subscription access
exports.checkSubscription = async (req, res, next) => {
    const user = req.user;

    // Admin always has access
    if (user.role === 'admin') {
        return next();
    }

    // Check if user has access
    if (!user.hasAccess()) {
        const now = new Date();
        let message = 'Your subscription has expired';
        let redirectTo = '/payment';

        if (user.subscription.status === 'trial' && now > user.subscription.trialEndDate) {
            message = 'Your 1-week free trial has ended. Please subscribe to continue.';
        } else if (user.subscription.status === 'expired') {
            message = 'Your subscription has expired. Please make a payment to continue.';
        } else if (user.subscription.status === 'restricted') {
            message = 'Your account is restricted. Please make a payment to continue.';
        } else if (user.subscription.status === 'pending') {
            // Give them a message but still allow access during grace period
            return next();
        }

        return res.status(403).json({
            message,
            redirectTo,
            requiresPayment: true,
            subscription: {
                status: user.subscription.status,
                trialEndDate: user.subscription.trialEndDate,
                currentPeriodEnd: user.subscription.currentPeriodEnd
            }
        });
    }

    // Check if payment is due soon (optional warning)
    if (user.subscription.status === 'active' && user.subscription.nextPaymentDueDate) {
        const now = new Date();
        const daysUntilDue = Math.ceil((user.subscription.nextPaymentDueDate - now) / (1000 * 60 * 60 * 24));

        if (daysUntilDue <= 3 && daysUntilDue > 0) {
            // Add a warning header but still allow access
            res.setHeader('X-Payment-Warning', `Payment due in ${daysUntilDue} days`);
        }
    }

    next();
};
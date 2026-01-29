// backend/src/controllers/payment.controller.js
const Payment = require('../models/Payment');
const User = require('../models/User');
const { uploadToCloudinary } = require('../utils/cloudinary');

exports.uploadReceipt = async (req, res) => {
    try {
        const tailorId = req.user.id;
        const { period, paymentMethod, transactionReference } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Receipt image is required' });
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file.path, 'receipts');

        const payment = await Payment.create({
            tailor: tailorId,
            period,
            paymentMethod,
            transactionReference,
            receiptImage: {
                url: result.secure_url,
                publicId: result.public_id
            }
        });

        res.status(201).json({ success: true, payment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.checkSubscription = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const now = new Date();

        if (user.subscription === 'free_trial' && now > user.trialEndsAt) {
            user.subscription = 'expired';
            await user.save();
        }

        if (user.subscription === 'expired') {
            return res.status(403).json({
                error: 'Subscription expired. Please make payment to continue.'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const Payment = require('../models/Payment');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// @desc    Create payment request
// @route   POST /api/payments
exports.createPayment = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a receipt' });
        }

        // Check if user can make a payment
        if (!user.canMakePayment()) {
            // Check if there's already a pending payment
            const hasPending = user.subscription.paymentHistory.some(
                p => p.status === 'pending'
            );

            if (hasPending) {
                return res.status(400).json({
                    message: 'You already have a pending payment. Please wait for approval.'
                });
            }

            // Check if it's too early for next payment
            if (user.subscription.status === 'active') {
                const nextDue = user.subscription.nextPaymentDueDate || user.subscription.currentPeriodEnd;
                const daysUntilDue = Math.ceil((nextDue - new Date()) / (1000 * 60 * 60 * 24));

                return res.status(400).json({
                    message: `Your next payment is due in ${daysUntilDue} days. You can only pay when due.`
                });
            }

            return res.status(400).json({
                message: 'You cannot make a payment at this time'
            });
        }

        // Calculate payment period
        const now = new Date();
        let periodStart, periodEnd;

        if (user.subscription.status === 'expired' || user.subscription.status === 'restricted') {
            // Reactivating - start from now
            periodStart = now;
            periodEnd = new Date(now);
            periodEnd.setDate(periodEnd.getDate() + 30);
        } else {
            // Regular monthly payment
            periodStart = user.subscription.currentPeriodEnd || now;
            periodEnd = new Date(periodStart);
            periodEnd.setDate(periodEnd.getDate() + 30);
        }

        // Create payment record
        const payment = await Payment.create({
            userId: req.user.id,
            amount: 1500,
            receiptUrl: `/uploads/${req.file.filename}`,
            receiptData: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                uploadDate: new Date()
            },
            status: 'pending',
            paymentDate: now,
            paymentPeriod: {
                month: periodStart.getMonth() + 1,
                year: periodStart.getFullYear()
            },
            periodStart,
            periodEnd
        });

        // Update user subscription status to pending
        user.subscription.status = 'pending';
        user.subscription.paymentHistory.push({
            amount: payment.amount,
            date: payment.paymentDate,
            receiptUrl: payment.receiptUrl,
            status: 'pending',
            paymentDate: payment.paymentDate,
            periodStart,
            periodEnd
        });

        await user.save();

        // Notify admin via email (optional)
        // You could fetch all admin emails and notify them

        console.log('✅ Payment uploaded:', payment._id);

        res.status(201).json({
            success: true,
            message: 'Payment receipt uploaded successfully. Awaiting approval.',
            payment
        });
    } catch (error) {
        console.error('Create payment error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin: Approve payment
// @route   PUT /api/payments/:id/approve
exports.approvePayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        const user = await User.findById(payment.userId);

        // Update payment status
        payment.status = 'approved';
        payment.approvalDate = new Date();
        await payment.save();

        // Update user subscription
        const now = new Date();

        // Find and update the pending payment in history
        const paymentHistoryItem = user.subscription.paymentHistory.find(
            p => p.status === 'pending' && p.date.toString() === payment.paymentDate.toString()
        );

        if (paymentHistoryItem) {
            paymentHistoryItem.status = 'approved';
            paymentHistoryItem.approvalDate = payment.approvalDate;
        }

        // Update subscription periods
        user.subscription.status = 'active';
        user.subscription.lastPaymentDate = payment.approvalDate;
        user.subscription.currentPeriodStart = payment.periodStart;
        user.subscription.currentPeriodEnd = payment.periodEnd;
        user.subscription.nextPaymentDueDate = payment.periodEnd;

        await user.save();

        // Send approval email
        await sendEmail({
            email: user.email,
            subject: 'Payment Approved - Subscription Active',
            html: `
                <h1>Payment Approved!</h1>
                <p>Your payment of ₦${payment.amount} has been approved.</p>
                <p>Your subscription is now active until: <strong>${payment.periodEnd.toLocaleDateString()}</strong></p>
                <p>Your next payment will be due on: <strong>${payment.periodEnd.toLocaleDateString()}</strong></p>
                <p>Thank you for using our service!</p>
            `
        });

        console.log('✅ Payment approved for user:', user.email);

        res.json({
            success: true,
            message: 'Payment approved successfully',
            payment
        });
    } catch (error) {
        console.error('Approve payment error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin: Decline payment
// @route   PUT /api/payments/:id/decline
exports.declinePayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        const user = await User.findById(payment.userId);

        // Update payment status
        payment.status = 'declined';
        payment.approvalNotes = req.body.reason;
        await payment.save();

        // Find and update the pending payment in history
        const paymentHistoryItem = user.subscription.paymentHistory.find(
            p => p.status === 'pending' && p.date.toString() === payment.paymentDate.toString()
        );

        if (paymentHistoryItem) {
            paymentHistoryItem.status = 'declined';
        }

        // If this was their only payment and trial is over, set to restricted
        const now = new Date();
        if (now > user.subscription.trialEndDate &&
            !user.subscription.paymentHistory.some(p => p.status === 'approved')) {
            user.subscription.status = 'restricted';
        } else {
            user.subscription.status = 'expired';
        }

        await user.save();

        // Send decline email
        await sendEmail({
            email: user.email,
            subject: 'Payment Declined - Action Required',
            html: `
                <h1>Payment Declined</h1>
                <p>Your payment of ₦${payment.amount} has been declined.</p>
                ${req.body.reason ? `<p><strong>Reason:</strong> ${req.body.reason}</p>` : ''}
                <p>Please upload a valid payment receipt to continue using the service.</p>
                <p>If you need assistance, please contact support.</p>
                <a href="${process.env.FRONTEND_URL}/payment" style="padding: 10px 20px; background: #10b981; color: white; text-decoration: none; border-radius: 5px;">Upload New Payment</a>
            `
        });

        console.log('❌ Payment declined for user:', user.email);

        res.json({
            success: true,
            message: 'Payment declined',
            payment
        });
    } catch (error) {
        console.error('Decline payment error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user payments
// @route   GET /api/payments
exports.getUserPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.user.id })
            .sort('-paymentDate');
        res.json(payments);
    } catch (error) {
        console.error('Get user payments error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin: Get all payments
// @route   GET /api/payments/admin
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('userId', 'name email subscription')
            .sort('-paymentDate');
        res.json(payments);
    } catch (error) {
        console.error('Get all payments error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check payment status and subscription
// @route   GET /api/payments/status
exports.getPaymentStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const status = {
            subscription: user.subscription.status,
            trialEndDate: user.subscription.trialEndDate,
            currentPeriodEnd: user.subscription.currentPeriodEnd,
            nextPaymentDue: user.subscription.nextPaymentDueDate,
            canMakePayment: user.canMakePayment(),
            hasAccess: user.hasAccess(),
            daysUntilNextPayment: null,
            hasPendingPayment: false
        };

        // Calculate days until next payment
        if (user.subscription.nextPaymentDueDate) {
            const now = new Date();
            const diffTime = user.subscription.nextPaymentDueDate - now;
            status.daysUntilNextPayment = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        // Check for pending payment
        status.hasPendingPayment = user.subscription.paymentHistory.some(
            p => p.status === 'pending'
        );

        res.json(status);
    } catch (error) {
        console.error('Get payment status error:', error);
        res.status(500).json({ message: error.message });
    }
};
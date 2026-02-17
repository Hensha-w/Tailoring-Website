const Feedback = require('../models/Feedback');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

// @desc    Create feedback
// @route   POST /api/feedback
exports.createFeedback = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const feedback = await Feedback.create({
            userId: req.user.id,
            userName: user.name,
            userEmail: user.email,
            subject: req.body.subject,
            message: req.body.message
        });

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin: Get all feedback
// @route   GET /api/feedback/admin
exports.getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find().sort('-createdAt');
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin: Respond to feedback
// @route   POST /api/feedback/:id/respond
exports.respondToFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        feedback.status = 'responded';
        feedback.response = {
            message: req.body.message,
            respondedAt: new Date(),
            respondedBy: req.user.id
        };

        await feedback.save();

        // Send response email
        await sendEmail({
            email: feedback.userEmail,
            subject: `Response to your feedback: ${feedback.subject}`,
            html: `
        <h1>Feedback Response</h1>
        <p>Your feedback:</p>
        <p><strong>${feedback.subject}</strong></p>
        <p>${feedback.message}</p>
        <hr>
        <p><strong>Our Response:</strong></p>
        <p>${req.body.message}</p>
      `
        });

        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userName: String,
    userEmail: String,
    subject: String,
    message: String,
    status: {
        type: String,
        enum: ['pending', 'responded', 'archived'],
        default: 'pending'
    },
    response: {
        message: String,
        respondedAt: Date,
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
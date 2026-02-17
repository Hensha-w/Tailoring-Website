const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        default: 1500
    },
    receiptUrl: String,
    receiptData: {
        filename: String,
        originalName: String,
        uploadDate: Date
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending'
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    approvalDate: Date,
    approvalNotes: String,
    paymentPeriod: {
        month: Number,
        year: Number
    },
    bankDetails: {
        accountName: String,
        accountNumber: String,
        bankName: String
    }
});

module.exports = mongoose.model('Payment', paymentSchema);
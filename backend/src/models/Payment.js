const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    tailor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 1500
    },
    currency: {
        type: String,
        default: 'NGN'
    },
    period: {
        type: String,
        required: true // Format: YYYY-MM
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined', 'cancelled'],
        default: 'pending'
    },
    receiptImage: {
        url: String,
        publicId: String
    },
    paymentMethod: {
        type: String,
        enum: ['bank_transfer', 'card', 'cash'],
        default: 'bank_transfer'
    },
    bankDetails: {
        accountName: {
            type: String,
            default: 'TailorCraft Solutions'
        },
        accountNumber: {
            type: String,
            default: '0123456789'
        },
        bankName: {
            type: String,
            default: 'Access Bank'
        }
    },
    transactionReference: {
        type: String,
        trim: true
    },
    adminNotes: {
        type: String,
        trim: true
    },
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    processedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', PaymentSchema);
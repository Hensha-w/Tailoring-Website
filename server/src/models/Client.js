// server/src/models/Client.js
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    tailorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    phone: String,
    email: String,
    address: String,
    measurements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Measurement'
    }],
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Client', clientSchema);
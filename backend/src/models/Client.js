const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    tailor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    measurements: {
        // Male measurements
        chest: { type: Number },
        waist: { type: Number },
        hips: { type: Number },
        shoulder: { type: Number },
        sleeveLength: { type: Number },
        backLength: { type: Number },
        neck: { type: Number },
        bicep: { type: Number },
        wrist: { type: Number },
        inseam: { type: Number },
        outseam: { type: Number },

        // Female measurements
        bust: { type: Number },
        underBust: { type: Number },
        waistFemale: { type: Number },
        hipsFemale: { type: Number },
        shoulderFemale: { type: Number },
        sleeveLengthFemale: { type: Number },
        backLengthFemale: { type: Number },
        dressLength: { type: Number },
        thigh: { type: Number },
        knee: { type: Number },
        ankle: { type: Number }
    },
    measurementNotes: {
        type: String,
        trim: true
    },
    bodyType: {
        type: String,
        enum: ['slim', 'average', 'athletic', 'plus_size', 'custom'],
        default: 'average'
    },
    preferences: {
        fit: {
            type: String,
            enum: ['tight', 'regular', 'loose'],
            default: 'regular'
        },
        styleNotes: {
            type: String,
            trim: true
        },
        favoriteColors: [{
            type: String,
            trim: true
        }],
        fabricPreferences: [{
            type: String,
            trim: true
        }]
    },
    lastMeasurementDate: {
        type: Date,
        default: Date.now
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

// Index for search functionality
ClientSchema.index({ firstName: 'text', lastName: 'text', phone: 'text', email: 'text' });

// Update updatedAt on save
ClientSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Client', ClientSchema);
// server/src/models/Measurement.js
const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    dateTaken: {
        type: Date,
        default: Date.now
    },
    // Male measurements
    chest: Number,
    waist: Number,
    hips: Number,
    shoulder: Number,
    sleeveLength: Number,
    shirtLength: Number,
    trouserLength: Number,
    inseam: Number,
    // Female measurements
    bust: Number,
    underBust: Number,
    dressLength: Number,
    skirtLength: Number,
    blouseLength: Number,
    // Common measurements
    neck: Number,
    armhole: Number,
    thigh: Number,
    knee: Number,
    ankle: Number,
    notes: String,
    images: [String] // URLs to uploaded images
});

module.exports = mongoose.model('Measurement', measurementSchema);
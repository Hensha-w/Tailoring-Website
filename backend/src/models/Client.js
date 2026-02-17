const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
    gender: {
        type: String,
        enum: ['male', 'female']
        // Not required here - it's on the main client schema
    },
    chest: Number,
    waist: Number,
    hips: Number,
    shoulder: Number,
    sleeveLength: Number,
    shirtLength: Number,
    trouserLength: Number,
    thigh: Number,
    knee: Number,
    calf: Number,
    neck: Number,
    bust: Number,
    underbust: Number,
    waistRise: Number,
    hipRise: Number,
    notes: String
}, { _id: false }); // Don't create an _id for subdocument

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female'],
            message: '{VALUE} is not a valid gender'
        },
        required: [true, 'Client gender is required']
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    address: String,
    measurements: {
        type: measurementSchema,
        default: {}
    },
    tailorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Tailor ID is required']
    },
    projects: [{
        type: {
            type: String,
            enum: ['shirt', 'trouser', 'suit', 'dress', 'skirt', 'blouse', 'other']
        },
        description: String,
        deadline: Date,
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed', 'delivered'],
            default: 'pending'
        },
        price: Number,
        deposit: Number,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Client', clientSchema);
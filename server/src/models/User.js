// server/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: function() { return !this.googleId; }
    },
    googleId: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['tailor', 'admin'],
        default: 'tailor'
    },
    subscription: {
        trialEnds: {
            type: Date,
            default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days from now
        },
        isActive: {
            type: Boolean,
            default: true
        },
        lastPayment: Date,
        nextPaymentDue: Date,
        payments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment'
        }]
    },
    settings: {
        darkMode: {
            type: Boolean,
            default: false
        },
        emailNotifications: {
            type: Boolean,
            default: true
        }
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.password) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
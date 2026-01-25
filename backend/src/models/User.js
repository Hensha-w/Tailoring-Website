const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
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
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: function() { return !this.googleId; }
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    role: {
        type: String,
        enum: ['tailor', 'admin'],
        default: 'tailor'
    },
    businessName: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    subscription: {
        type: String,
        enum: ['free_trial', 'active', 'expired', 'cancelled'],
        default: 'free_trial'
    },
    trialEndsAt: {
        type: Date,
        default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days from now
    },
    currentPeriodEnd: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
    },
    notificationPreferences: {
        email: {
            type: Boolean,
            default: true
        },
        calendarReminders: {
            type: Boolean,
            default: true
        },
        paymentReminders: {
            type: Boolean,
            default: true
        }
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

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Update updatedAt on save
UserSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
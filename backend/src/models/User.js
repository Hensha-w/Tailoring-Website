const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId;
        }
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    subscription: {
        status: {
            type: String,
            enum: ['trial', 'active', 'expired', 'pending', 'restricted'],
            default: 'trial'
        },
        trialStartDate: {
            type: Date,
            default: Date.now
        },
        trialEndDate: {
            type: Date,
            default: function() {
                return new Date(+new Date() + 7 * 24 * 60 * 60 * 1000); // 7 days
            }
        },
        currentPeriodStart: {
            type: Date,
            default: Date.now
        },
        currentPeriodEnd: {
            type: Date,
            default: function() {
                return new Date(+new Date() + 30 * 24 * 60 * 60 * 1000); // 30 days
            }
        },
        lastPaymentDate: Date,
        nextPaymentDueDate: Date,
        paymentHistory: [{
            amount: Number,
            date: Date,
            receiptUrl: String,
            status: {
                type: String,
                enum: ['pending', 'approved', 'declined']
            },
            paymentDate: Date,
            approvalDate: Date,
            periodStart: Date,
            periodEnd: Date
        }]
    },
    settings: {
        darkMode: {
            type: Boolean,
            default: false
        },
        notifications: {
            emailReminders: {
                type: Boolean,
                default: true
            }
        }
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Method to check if user can make payment
userSchema.methods.canMakePayment = function() {
    const now = new Date();

    if (this.role === 'admin') return false;

    const hasPendingPayment = this.subscription.paymentHistory.some(
        p => p.status === 'pending'
    );
    if (hasPendingPayment) return false;

    if (this.subscription.status === 'active') {
        const nextPaymentDue = this.subscription.nextPaymentDueDate || this.subscription.currentPeriodEnd;
        return now >= nextPaymentDue;
    }

    if (this.subscription.status === 'expired' || this.subscription.status === 'restricted') {
        return true;
    }

    if (this.subscription.status === 'trial') {
        return false;
    }

    return true;
};

// Method to check if user has access to app features
userSchema.methods.hasAccess = function() {
    const now = new Date();

    if (this.role === 'admin') return true;

    if (this.subscription.status === 'trial') {
        return now <= this.subscription.trialEndDate;
    }

    if (this.subscription.status === 'active') {
        return now <= this.subscription.currentPeriodEnd;
    }

    if (this.subscription.status === 'pending') {
        const lastPayment = this.subscription.paymentHistory
            .filter(p => p.status === 'pending')
            .sort((a, b) => b.date - a.date)[0];

        if (lastPayment) {
            const graceEnd = new Date(lastPayment.date);
            graceEnd.setDate(graceEnd.getDate() + 3);
            return now <= graceEnd;
        }
    }

    return false;
};

// Pre-save middleware - FIXED: removed the extra 'next' parameter that was causing the error
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
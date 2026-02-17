const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    clientName: {
        type: String,
        trim: true
    },
    tailorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Tailor ID is required']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date
    },
    allDay: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        enum: {
            values: ['collection', 'fitting', 'deadline', 'other'],
            message: '{VALUE} is not a valid event type'
        },
        required: [true, 'Event type is required']
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    reminderSent: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient querying
calendarEventSchema.index({ tailorId: 1, startDate: 1 });
calendarEventSchema.index({ tailorId: 1, type: 1 });
calendarEventSchema.index({ tailorId: 1, status: 1 });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
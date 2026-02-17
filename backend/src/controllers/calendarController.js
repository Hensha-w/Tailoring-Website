const CalendarEvent = require('../models/CalendarEvent');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

// @desc    Get all events
// @route   GET /api/calendar
exports.getEvents = async (req, res) => {
    try {
        const events = await CalendarEvent.find({ tailorId: req.user.id })
            .populate('clientId', 'name')
            .sort('startDate');
        res.json(events);
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create event
// @route   POST /api/calendar
exports.createEvent = async (req, res) => {
    try {
        console.log('Creating event with data:', req.body);

        // Validate dates
        const startDate = new Date(req.body.startDate);
        if (isNaN(startDate.getTime())) {
            return res.status(400).json({ message: 'Invalid start date' });
        }

        // Check if date is in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day for comparison

        if (startDate < today) {
            return res.status(400).json({
                message: 'Cannot create events on past dates. Please select a future date.'
            });
        }

        const eventData = {
            ...req.body,
            startDate,
            tailorId: req.user.id
        };

        // Handle end date if provided
        if (req.body.endDate) {
            const endDate = new Date(req.body.endDate);
            if (!isNaN(endDate.getTime())) {
                // Also validate end date is not in the past
                if (endDate < today) {
                    return res.status(400).json({
                        message: 'End date cannot be in the past.'
                    });
                }
                eventData.endDate = endDate;
            }
        }

        const event = await CalendarEvent.create(eventData);
        console.log('Event created:', event._id);

        // Send email notification
        const user = await User.findById(req.user.id);
        if (user.settings?.notifications?.emailReminders) {
            try {
                await sendEmail({
                    email: user.email,
                    subject: `New Event: ${event.title}`,
                    html: `
                        <h1>New Calendar Event</h1>
                        <p><strong>Event:</strong> ${event.title}</p>
                        <p><strong>Date:</strong> ${new Date(event.startDate).toLocaleDateString()}</p>
                        <p><strong>Type:</strong> ${event.type}</p>
                        ${event.description ? `<p><strong>Description:</strong> ${event.description}</p>` : ''}
                    `
                });
            } catch (emailError) {
                console.error('Failed to send email:', emailError);
            }
        }

        res.status(201).json(event);
    } catch (error) {
        console.error('Create event error:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                message: 'Validation failed',
                errors: messages
            });
        }

        res.status(500).json({ message: error.message });
    }
};

// @desc    Update event
// @route   PUT /api/calendar/:id
exports.updateEvent = async (req, res) => {
    try {
        console.log('Updating event:', req.params.id);
        console.log('Update data:', req.body);

        const updateData = { ...req.body };
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Handle date updates with validation
        if (req.body.startDate) {
            const startDate = new Date(req.body.startDate);
            if (!isNaN(startDate.getTime())) {
                // Allow updating existing events even if date is in the past?
                // You might want different logic here
                if (startDate < today && !req.body.allowPastDate) {
                    return res.status(400).json({
                        message: 'Cannot update event to a past date.'
                    });
                }
                updateData.startDate = startDate;
            }
        }

        if (req.body.endDate) {
            const endDate = new Date(req.body.endDate);
            if (!isNaN(endDate.getTime())) {
                if (endDate < today && !req.body.allowPastDate) {
                    return res.status(400).json({
                        message: 'End date cannot be in the past.'
                    });
                }
                updateData.endDate = endDate;
            }
        } else if (req.body.endDate === null) {
            updateData.endDate = null;
        }

        const event = await CalendarEvent.findOneAndUpdate(
            { _id: req.params.id, tailorId: req.user.id },
            updateData,
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        console.log('Event updated:', event._id);
        res.json(event);
    } catch (error) {
        console.error('Update event error:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                message: 'Validation failed',
                errors: messages
            });
        }

        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete event
// @route   DELETE /api/calendar/:id
exports.deleteEvent = async (req, res) => {
    try {
        const event = await CalendarEvent.findOneAndDelete({
            _id: req.params.id,
            tailorId: req.user.id
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({ success: true, message: 'Event deleted' });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ message: error.message });
    }
};
// backend/src/controllers/calendar.controller.js
const CalendarEvent = require('../models/CalendarEvent');
const Client = require('../models/Client');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

// Schedule daily reminders
cron.schedule('0 9 * * *', async () => {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const dayAfter = new Date(tomorrow);
        dayAfter.setDate(dayAfter.getDate() + 1);

        const events = await CalendarEvent.find({
            startDate: { $gte: tomorrow, $lt: dayAfter },
            notificationSent: false,
            status: 'scheduled'
        }).populate('tailor client');

        for (const event of events) {
            await sendCalendarReminder(event);
            event.notificationSent = true;
            await event.save();
        }
    } catch (error) {
        console.error('Cron job error:', error);
    }
});

exports.createEvent = async (req, res) => {
    try {
        const { clientId, title, description, type, startDate, endDate } = req.body;

        const event = await CalendarEvent.create({
            tailor: req.user.id,
            client: clientId,
            title,
            description,
            type,
            startDate,
            endDate
        });

        // Send immediate notification for high priority
        if (req.body.priority === 'high') {
            await sendEventCreatedNotification(event);
        }

        res.status(201).json({ success: true, event });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
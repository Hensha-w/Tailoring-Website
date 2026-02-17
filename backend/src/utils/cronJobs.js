const cron = require('node-cron');
const CalendarEvent = require('../models/CalendarEvent');
const User = require('../models/User');
const { sendEmail } = require('./emailService');

// Check for upcoming events every day at 8 AM
cron.schedule('0 8 * * *', async () => {
    console.log('🔍 Running cron: Checking for upcoming events...');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const upcomingEvents = await CalendarEvent.find({
        startDate: {
            $gte: tomorrow,
            $lt: dayAfterTomorrow
        },
        reminderSent: false,
        status: 'pending'
    }).populate('tailorId', 'email name settings');

    for (const event of upcomingEvents) {
        const user = event.tailorId;

        if (user.settings?.notifications?.emailReminders) {
            await sendEmail({
                email: user.email,
                subject: `Reminder: ${event.title} Tomorrow`,
                html: `
                    <h1>Event Reminder</h1>
                    <p>You have an event scheduled for tomorrow:</p>
                    <p><strong>${event.title}</strong></p>
                    <p>Date: ${new Date(event.startDate).toLocaleDateString()}</p>
                    <p>Type: ${event.type}</p>
                    ${event.description ? `<p>Description: ${event.description}</p>` : ''}
                    ${event.clientName ? `<p>Client: ${event.clientName}</p>` : ''}
                `
            });

            event.reminderSent = true;
            await event.save();
        }
    }

    console.log(`✅ Sent ${upcomingEvents.length} reminders`);
});

// Check subscription statuses every day at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('🔍 Running cron: Checking subscription statuses...');

    const now = new Date();

    // Check for expired trials (7 days)
    const expiredTrials = await User.find({
        role: 'user',
        'subscription.status': 'trial',
        'subscription.trialEndDate': { $lt: now }
    });

    for (const user of expiredTrials) {
        user.subscription.status = 'expired';
        await user.save();

        await sendEmail({
            email: user.email,
            subject: 'Your 1-Week Free Trial Has Expired',
            html: `
                <h1>Your Free Trial Has Ended</h1>
                <p>Your 1-week free trial period has ended.</p>
                <p>To continue using our services, please subscribe with ₦1500/month.</p>
                <a href="${process.env.FRONTEND_URL}/payment" style="padding: 10px 20px; background: #10b981; color: white; text-decoration: none; border-radius: 5px;">Subscribe Now</a>
            `
        });
    }

    // Check for expiring subscriptions (3 days before)
    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const expiringSoon = await User.find({
        role: 'user',
        'subscription.status': 'active',
        'subscription.nextPaymentDueDate': {
            $lte: threeDaysFromNow,
            $gt: now
        }
    });

    for (const user of expiringSoon) {
        const daysUntilDue = Math.ceil((user.subscription.nextPaymentDueDate - now) / (1000 * 60 * 60 * 24));

        await sendEmail({
            email: user.email,
            subject: 'Payment Due Soon - Reminder',
            html: `
                <h1>Payment Due in ${daysUntilDue} Days</h1>
                <p>Your subscription payment of ₦1500 is due on ${user.subscription.nextPaymentDueDate.toLocaleDateString()}.</p>
                <p>Please make your payment to avoid service interruption.</p>
                <a href="${process.env.FRONTEND_URL}/payment" style="padding: 10px 20px; background: #10b981; color: white; text-decoration: none; border-radius: 5px;">Make Payment</a>
            `
        });
    }

    // Check for expired subscriptions
    const expiredSubscriptions = await User.find({
        role: 'user',
        'subscription.status': 'active',
        'subscription.currentPeriodEnd': { $lt: now }
    });

    for (const user of expiredSubscriptions) {
        user.subscription.status = 'expired';
        await user.save();

        await sendEmail({
            email: user.email,
            subject: 'Your Subscription Has Expired',
            html: `
                <h1>Subscription Expired</h1>
                <p>Your subscription period has ended.</p>
                <p>Please make a payment to reactivate your account.</p>
                <a href="${process.env.FRONTEND_URL}/payment" style="padding: 10px 20px; background: #10b981; color: white; text-decoration: none; border-radius: 5px;">Make Payment</a>
            `
        });
    }

    console.log(`✅ Processed ${expiredTrials.length} expired trials`);
    console.log(`✅ Processed ${expiringSoon.length} expiring soon reminders`);
    console.log(`✅ Processed ${expiredSubscriptions.length} expired subscriptions`);
});
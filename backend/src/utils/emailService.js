const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        // Add timeout settings
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000,
        socketTimeout: 10000
    });
};

exports.sendEmail = async (options) => {
    console.log('📧 Attempting to send email to:', options.email);

    try {
        // Validate email configuration
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('Email configuration is missing. Please check your .env file.');
        }

        const transporter = createTransporter();

        // Verify connection before sending
        await transporter.verify();
        console.log('✅ SMTP connection verified');

        const mailOptions = {
            from: `"TailorPro" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully. Message ID:', info.messageId);

        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('❌ Email sending failed:', error);

        // Provide specific error messages
        if (error.code === 'EAUTH') {
            throw new Error('Email authentication failed. Please check your Gmail app password.');
        } else if (error.code === 'ESOCKET') {
            throw new Error('Could not connect to email server. Check your internet connection.');
        } else if (error.code === 'ECONNREFUSED') {
            throw new Error('Connection refused by email server.');
        } else {
            throw new Error(`Email sending failed: ${error.message}`);
        }
    }
};
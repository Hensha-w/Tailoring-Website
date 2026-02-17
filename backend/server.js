const dotenv = require('dotenv');
const path = require('path');

// Load environment variables - make sure this runs before any other imports
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Check if MongoDB URI is defined
if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env file');
    console.error('Please create a .env file in the backend folder with your MongoDB connection string');
    process.exit(1);
}

const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    // Hide sensitive info in logs
    const dbUri = process.env.MONGODB_URI;
    const maskedUri = dbUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    console.log(`📊 MongoDB URI: ${maskedUri}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`❌ Unhandled Rejection: ${err.message}`);
    console.log(err.stack);
    // Close server & exit process
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`❌ Uncaught Exception: ${err.message}`);
    console.log(err.stack);
    process.exit(1);
});
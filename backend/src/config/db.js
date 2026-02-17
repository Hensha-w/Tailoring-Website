const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Remove deprecated options - they are no longer needed in Mongoose 6+
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📁 Database: ${conn.connection.name}`);

        // Create indexes for better performance
        await createIndexes(conn);

        return conn;
    } catch (err) {
        console.error(`❌ MongoDB connection error: ${err.message}`);
        process.exit(1);
    }
};

// Create indexes for better performance
const createIndexes = async (conn) => {
    try {
        const db = conn.connection.db;

        // Check if collections exist before creating indexes
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);

        // User indexes
        if (collectionNames.includes('users')) {
            await db.collection('users').createIndex({ email: 1 }, { unique: true });
            await db.collection('users').createIndex({ googleId: 1 }, { sparse: true });
        }

        // Client indexes
        if (collectionNames.includes('clients')) {
            await db.collection('clients').createIndex({ tailorId: 1 });
            await db.collection('clients').createIndex({ name: 1 });
        }

        // Calendar event indexes
        if (collectionNames.includes('calendarevents')) {
            await db.collection('calendarevents').createIndex({ tailorId: 1 });
            await db.collection('calendarevents').createIndex({ startDate: 1 });
        }

        console.log('✅ Database indexes created/verified');
    } catch (error) {
        console.log('⚠️ Index creation skipped:', error.message);
    }
};

module.exports = connectDB;
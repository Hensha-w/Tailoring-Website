const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testMongooseVersion() {
    console.log('🔍 Testing Mongoose version:', mongoose.version);

    // Create a fresh schema
    const testSchema = new mongoose.Schema({
        name: String,
        email: { type: String, unique: true },
        password: String
    });

    // Test different middleware patterns
    console.log('\n📝 Testing Pattern 1: Callback style');
    testSchema.pre('save', function(next) {
        console.log('   ✅ Pattern 1: Callback received');
        console.log('   🔧 typeof next:', typeof next);
        console.log('   🔧 Is next a function?', typeof next === 'function');

        if (typeof next === 'function') {
            console.log('   ✅ Calling next()');
            next();
        } else {
            console.log('   ❌ next is not a function');
        }
    });

    const TestModel = mongoose.model('Test', testSchema);

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const test = new TestModel({
            name: 'Test User',
            email: `test${Date.now()}@test.com`,
            password: 'password123'
        });

        console.log('\n📝 Attempting to save...');
        await test.save();
        console.log('✅ Save successful - middleware worked!');

        await TestModel.deleteMany({ email: test.email });
        console.log('✅ Cleanup complete');

    } catch (error) {
        console.error('❌ Error:', error);
        console.log('\n🔍 Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
    } finally {
        await mongoose.disconnect();
    }
}

testMongooseVersion();
const mongoose = require('mongoose');
require('dotenv').config();

async function testOrderFunctionality() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const ordersCollection = db.collection('orders');

        // Check if orders collection exists and has data
        const orderCount = await ordersCollection.countDocuments();
        console.log(`📊 Total orders in database: ${orderCount}`);

        if (orderCount > 0) {
            const sampleOrder = await ordersCollection.findOne();
            console.log('📋 Sample order structure:');
            console.log(JSON.stringify(sampleOrder, null, 2));
        } else {
            console.log('📝 No orders found in database');
            console.log('💡 Try placing an order through the app to test functionality');
        }

        // Check users collection
        const usersCollection = db.collection('users');
        const userCount = await usersCollection.countDocuments();
        console.log(`👥 Total users in database: ${userCount}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

testOrderFunctionality();

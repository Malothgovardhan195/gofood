const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;

async function updateImages() {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('food_items');

        // Example: Update specific item image
        // Replace "Paneer Biryani" with your item name and new image URL
        const updateResult = await collection.updateOne(
            { name: "Paneer Biryani" },
            { 
                $set: { 
                    img: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500" 
                } 
            }
        );

        console.log(`📸 Updated ${updateResult.modifiedCount} image(s)`);

        // Show updated item
        const updatedItem = await collection.findOne({ name: "Paneer Biryani" });
        console.log('Updated item:', updatedItem);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating images:', error);
        process.exit(1);
    }
}

// Uncomment the line below to run the update
// updateImages();

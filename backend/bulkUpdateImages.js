const mongoose = require('mongoose');
require('dotenv').config();

// New image URLs for each food item
const imageUpdates = {
    "Veg Biryani": "https://images.unsplash.com/photo-1563379091339-03246963d51a?w=500",
    "Jeera Rice": "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=500", 
    "Paneer Biryani": "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500",
    "Margherita Pizza": "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500",
    "Veggie Supreme Pizza": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
    "Paneer Tikka Pizza": "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500",
    "Paneer Tikka": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500",
    "Samosa": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500",
    "Veg Spring Rolls": "https://images.unsplash.com/photo-1544025162-d76694265947?w=500",
    "Aloo Tikki": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500",
    "Veg Pakora": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500"
};

async function bulkUpdateImages() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('food_items');

        let updateCount = 0;

        for (const [itemName, newImageUrl] of Object.entries(imageUpdates)) {
            const result = await collection.updateOne(
                { name: itemName },
                { $set: { img: newImageUrl } }
            );
            
            if (result.modifiedCount > 0) {
                console.log(`📸 Updated image for: ${itemName}`);
                updateCount++;
            }
        }

        console.log(`\n✅ Successfully updated ${updateCount} images!`);
        
        // Show all items with their current images
        const allItems = await collection.find({}).toArray();
        console.log('\n📋 Current items and images:');
        allItems.forEach((item, index) => {
            console.log(`${index + 1}. ${item.name}: ${item.img.substring(0, 60)}...`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating images:', error);
        process.exit(1);
    }
}

// Uncomment the line below to run the bulk update
// bulkUpdateImages();

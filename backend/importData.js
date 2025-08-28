const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;

async function importData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // Get database
        const db = mongoose.connection.db;

        // Read and import food categories
        const categoriesData = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'data', 'foodCategory.json'), 'utf8')
        );

        // Insert categories
        const categoriesCollection = db.collection('Categories');
        
        // Clear existing categories (optional)
        await categoriesCollection.deleteMany({});
        console.log('🗑️  Cleared existing categories');

        // Insert new categories
        const categoryResult = await categoriesCollection.insertMany(categoriesData);
        console.log(`📂 Inserted ${categoryResult.insertedCount} categories successfully!`);

        // Read and import food items if the file exists
        const foodItemsPath = path.join(__dirname, 'data', 'sampleFoodItems.json');
        if (fs.existsSync(foodItemsPath)) {
            const foodItemsData = JSON.parse(
                fs.readFileSync(foodItemsPath, 'utf8')
            );

            const foodItemsCollection = db.collection('food_items');
            
            // Clear existing food items (optional)
            await foodItemsCollection.deleteMany({});
            console.log('🗑️  Cleared existing food items');

            // Insert new food items
            const foodResult = await foodItemsCollection.insertMany(foodItemsData);
            console.log(`🍕 Inserted ${foodResult.insertedCount} food items successfully!`);
        }

        // Display imported data
        const insertedCategories = await categoriesCollection.find({}).toArray();
        const insertedFoodItems = await db.collection('food_items').find({}).toArray();
        
        console.log('\n📋 Final Database Status:');
        console.log(`   Categories: ${insertedCategories.length}`);
        insertedCategories.forEach((cat, index) => {
            console.log(`     ${index + 1}. ${cat.CategoryName}`);
        });
        
        console.log(`   Food Items: ${insertedFoodItems.length}`);
        insertedFoodItems.forEach((item, index) => {
            console.log(`     ${index + 1}. ${item.name} (${item.CategoryName})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error importing data:', error);
        process.exit(1);
    }
}

importData();

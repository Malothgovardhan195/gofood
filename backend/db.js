const mongoose = require('mongoose')
require('dotenv').config()

const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb+srv://ajitsingh:as5759423@cluster0.8lgsfn3.mongodb.net/gofoodmern?retryWrites=true&w=majority&appName=Cluster0';

module.exports = async function (callback) {
    try {
        await mongoose.connect(mongoURI, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });
        
        console.log("✅ Connected to MongoDB successfully!")
        
        const foodCollection = mongoose.connection.db.collection("food_items");
        const foodData = await foodCollection.find({}).toArray();
        console.log(`📦 Found ${foodData.length} food items`);
        
        const categoryCollection = mongoose.connection.db.collection("Categories");
        const categoryData = await categoryCollection.find({}).toArray();
        console.log(`📂 Found ${categoryData.length} categories`);
        
        callback(null, foodData, categoryData);
        
    } catch (err) {
        console.log("❌ MongoDB Connection Error: " + err)
        console.log("🔧 Please check:")
        console.log("   1. MongoDB Atlas cluster is running")
        console.log("   2. Network access allows your IP")
        console.log("   3. Database user credentials are correct")
        console.log("   4. Connection string is valid")
        callback(err, null, null);
    }
};
                    callback(err, data, Catdata);
                })
            });
            // listCollections({name: 'food_items'}).toArray(function (err, database) {
            // });
            //     module.exports.Collection = database;
            // });
        }
    })
};

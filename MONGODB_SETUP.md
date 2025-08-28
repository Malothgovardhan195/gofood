# MongoDB Reconnection Guide

## Steps to Fix Database Connection:

### 1. Check MongoDB Atlas
- Visit: https://cloud.mongodb.com/
- Login to your account
- Verify Cluster0 is running (not paused)

### 2. Get New Connection String
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string
- It should look like: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gofoodmern?retryWrites=true&w=majority

### 3. Update db.js file
Replace the mongoURI in backend/db.js with your new connection string

### 4. Network Access
- In Atlas, go to "Network Access"
- Add your current IP address: 0.0.0.0/0 (for development)

### 5. Database Access
- Go to "Database Access"
- Verify your user credentials
- Username: ajitsingh
- Make sure password is correct

### 6. Restore Data (if database is empty)
You'll need to re-add your collections:
- food_items
- Categories
- users
- orders

## Test Connection
Run: node index.js in backend folder
Should see: "connected to mongo"

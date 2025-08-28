#!/bin/bash

# Backend Deployment Script for Render/Railway/Heroku

echo "🚀 Starting Backend Deployment Process..."

# Step 1: Navigate to backend directory
cd backend

# Step 2: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 3: Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Creating .env file from example..."
    cp .env.example .env
    echo "📝 Please update the .env file with your actual values:"
    echo "   - MONGO_URI: Your MongoDB connection string"
    echo "   - JWT_SECRET: A secure random string"
    echo "   - FRONTEND_URL: Your Vercel frontend URL"
fi

# Step 4: Test the server locally
echo "🔍 Testing server locally..."
npm run dev &
SERVER_PID=$!
sleep 3

# Check if server is running
if curl -f http://localhost:5000/ > /dev/null 2>&1; then
    echo "✅ Server is running successfully on localhost:5000"
    kill $SERVER_PID
else
    echo "❌ Server failed to start. Check your configuration."
    kill $SERVER_PID
    exit 1
fi

echo "🎉 Backend is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Deploy on Render/Railway/Heroku using the guide"
echo "3. Update frontend environment variables with your backend URL"
echo "4. Redeploy your frontend"

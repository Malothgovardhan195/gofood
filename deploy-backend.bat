@echo off
echo 🚀 Starting Backend Deployment Process...

cd backend

echo 📦 Installing dependencies...
npm install

if not exist ".env" (
    echo ⚠️  Creating .env file from example...
    copy .env.example .env
    echo 📝 Please update the .env file with your actual values:
    echo    - MONGO_URI: Your MongoDB connection string
    echo    - JWT_SECRET: A secure random string
    echo    - FRONTEND_URL: Your Vercel frontend URL
)

echo 🔍 Testing server locally...
start /b npm run dev
timeout /t 3 /nobreak > nul

curl http://localhost:5000/ > nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Server is running successfully on localhost:5000
) else (
    echo ❌ Server failed to start. Check your configuration.
    exit /b 1
)

taskkill /f /im node.exe > nul 2>&1

echo 🎉 Backend is ready for deployment!
echo.
echo Next steps:
echo 1. Push your code to GitHub
echo 2. Deploy on Render/Railway/Heroku using the guide
echo 3. Update frontend environment variables with your backend URL
echo 4. Redeploy your frontend

pause

# Backend Deployment Guide

## Option 1: Deploy Backend on Render (Recommended - Free)

### Step 1: Prepare Backend for Deployment

1. **Update CORS in backend/index.js:**
```javascript
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "https://tastydash9.vercel.app");
  res.header(
    "Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
```

2. **Create backend/.env file:**
```
 MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
FRONTEND_URL=https://tastydash9.vercel.app
```

3. **Update backend/package.json scripts:**
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

### Step 2: Deploy on Render

1. **Create account:** Go to [render.com](https://render.com) and sign up
2. **Connect GitHub:** Link your GitHub repository
3. **Create Web Service:**
   - Click "New" → "Web Service"
   - Connect your repository
   - Select the `backend` folder as root directory
   - Settings:
     - **Name:** `gofood-backend`
     - **Environment:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Instance Type:** Free

4. **Add Environment Variables:**
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret
   - `FRONTEND_URL`: Your Vercel frontend URL

### Step 3: Get MongoDB Connection String

**Option A: MongoDB Atlas (Free)**
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free account and cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/gofood`

**Option B: MongoDB Cloud (Alternative)**
1. Use any MongoDB cloud provider
2. Get connection string

## Option 2: Deploy Backend on Railway

### Step 1: Railway Deployment
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "Deploy from GitHub repo"
4. Select your repository
5. Set root directory to `/backend`
6. Add environment variables (same as above)

## Option 3: Deploy Backend on Heroku

### Step 1: Heroku Deployment
1. Create account on [heroku.com](https://heroku.com)
2. Install Heroku CLI
3. Run these commands in backend folder:
```bash
heroku create gofood-backend
heroku config:set MONGO_URI=your_connection_string
heroku config:set JWT_SECRET=your_secret
git init
git add .
git commit -m "Deploy backend"
git push heroku main
```

## Step 4: Update Frontend to Use Real Backend

### Create Environment Configuration

1. **Create src/config/api.js:**
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL 
  || process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.render.com' // Replace with your backend URL
  : 'http://localhost:5000';

export default API_BASE_URL;
```

2. **Update .env files:**

**.env.local (for development):**
```
REACT_APP_API_URL=http://localhost:5000
```

**.env.production (for production):**
```
REACT_APP_API_URL=https://your-backend-url.render.com
```

### Step 5: Update Frontend API Calls

1. **Update src/screens/HomeFixed.js:**
```javascript
import API_BASE_URL from '../config/api';

const loadFoodItems = async () => {
  try {
    if (USE_MOCK_DATA && !process.env.REACT_APP_API_URL) {
      // Use mock data only if no API URL is configured
      const data = await mockApiService.getFoodData();
      setFoodItems(data[0]);
      setFoodCat(data[1]);
    } else {
      // Use real API
      let response = await fetch(`${API_BASE_URL}/api/auth/foodData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to fetch');
      let data = await response.json();
      setFoodItems(data[0]);
      setFoodCat(data[1]);
    }
  } catch (error) {
    console.error("Error loading food items:", error);
  }
};
```

## Step 6: Quick Backend Deployment Commands

### For Render:
1. Push your code to GitHub
2. Connect repository on Render dashboard
3. Deploy automatically

### For Railway:
```bash
cd backend
npm install -g @railway/cli
railway login
railway init
railway up
```

### For Heroku:
```bash
cd backend
npm install -g heroku
heroku login
heroku create your-app-name
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a your-app-name
git push heroku main
```

## Step 7: Test Backend Connection

1. **Test backend endpoint:**
   - Visit: `https://your-backend-url.com/api/auth/foodData`
   - Should return food data

2. **Update frontend environment:**
   - Add your backend URL to Vercel environment variables
   - Redeploy frontend

## Step 8: Environment Variables for Vercel

In your Vercel dashboard:
1. Go to your project settings
2. Add environment variable:
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://your-backend-url.render.com`
3. Redeploy your frontend

## Troubleshooting

### Common Issues:

1. **CORS Error:**
   - Update backend CORS to include your frontend URL
   - Check Access-Control-Allow-Origin headers

2. **Environment Variables:**
   - Ensure all required env vars are set in backend
   - Check MongoDB connection string

3. **Build Errors:**
   - Ensure all dependencies are in package.json
   - Check Node.js version compatibility

### Quick Fix Commands:
```bash
# Check backend logs
# On Render: Check logs in dashboard
# On Railway: railway logs
# On Heroku: heroku logs --tail

# Test API endpoints
curl https://your-backend-url.com/api/auth/foodData
```

## Final Steps

1. Deploy backend using any option above
2. Get your backend URL
3. Update frontend environment variables
4. Redeploy frontend
5. Test complete application

Your app will now use real backend with database instead of mock data!

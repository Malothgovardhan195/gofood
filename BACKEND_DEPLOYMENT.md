# 🚀 Backend Deployment Guide - Render.com

## 📋 **Quick Backend Deployment (Free)**

### **Step 1: Prepare Backend for Deployment**

1. **Create render.yaml in backend folder**:
```yaml
services:
  - type: web
    name: gofood-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGO_URI
        value: your_mongodb_connection_string
```

### **Step 2: Deploy to Render**

1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. **New Web Service**
4. **Connect your GitHub repo**
5. **Select backend folder**
6. **Configure**:
   - **Name**: `gofood-backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### **Step 3: Environment Variables**
Add these in Render dashboard:
- `NODE_ENV`: `production`
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your JWT secret

### **Step 4: Get Backend URL**
After deployment, you'll get:
`https://gofood-backend.onrender.com`

---

## 🔧 **Alternative: Vercel Backend Deployment**

### **Create vercel.json in backend folder**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "./index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```

### **Deploy Steps**:
1. `cd backend`
2. `vercel --prod`
3. Get URL: `https://gofood-backend.vercel.app`

---

## ⚡ **Quick Fix - Mock Data (No Backend Needed)**

If you want to deploy frontend immediately without backend:

1. **Create mock data** for demonstration
2. **Update API calls** to use static data
3. **Deploy frontend only**
4. **Add backend later**

**Choose your approach and let's deploy! 🚀**

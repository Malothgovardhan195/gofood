
require('dotenv').config();

global.foodData = require('./db')(function call(err, data, CatData) {
  // console.log(data)
  if(err) console.log(err);
  global.foodData = data;
  global.foodCategory = CatData;
})

const express = require('express')
const app = express()
const port = process.env.PORT || 5000

// Updated CORS for production deployment
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001", 
    process.env.FRONTEND_URL,
    "https://tastydash9.vercel.app"
  ].filter(Boolean);
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(express.json())

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'GoFood Backend API is running!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
})

app.use('/api/auth', require('./Routes/Auth'));

app.listen(port, () => {
  console.log(`GoFood Backend listening on port ${port}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})


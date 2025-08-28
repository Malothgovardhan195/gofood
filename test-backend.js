#!/usr/bin/env node

// Backend Deployment Test Script for TastyDash
const https = require('https');

function testBackendEndpoint(url) {
  console.log(`🔍 Testing: ${url}`);
  
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Backend is responding!');
          console.log('📄 Response:', data);
          resolve(data);
        } else {
          console.log(`❌ Error: Status ${res.statusCode}`);
          reject(new Error(`Status: ${res.statusCode}`));
        }
      });
    }).on('error', (err) => {
      console.log('❌ Connection failed:', err.message);
      reject(err);
    });
  });
}

// Usage: node test-backend.js https://your-backend-url.render.com
const backendUrl = process.argv[2];

if (!backendUrl) {
  console.log('📋 Usage: node test-backend.js https://your-backend-url.render.com');
  console.log('🔗 Replace with your actual Render backend URL');
  process.exit(1);
}

console.log('🚀 Testing TastyDash Backend...');
testBackendEndpoint(backendUrl)
  .then(() => {
    console.log('🎉 Backend deployment successful!');
    console.log('📝 Next: Update Vercel environment variable');
  })
  .catch((err) => {
    console.log('🛠️  Check Render logs for deployment issues');
  });

// Cart Debug Test - Add this to browser console on TastyDash

console.log("🔍 Cart Debug Test");

// Check if items are loading
console.log("Food items loaded:", document.querySelectorAll('.card').length);

// Check if Add to Cart buttons exist
console.log("Add to Cart buttons:", document.querySelectorAll('button').length);

// Check cart state (if accessible)
try {
  const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
  console.log("Current cart:", cartData);
} catch (e) {
  console.log("No cart in localStorage");
}

// Check if backend API is being used
fetch(window.location.origin + '/api/test')
  .then(() => console.log("✅ Using real backend"))
  .catch(() => console.log("❌ Using mock data"));

// Test specific add to cart functionality
function testAddToCart() {
  const addButton = document.querySelector('button:contains("Add to Cart")');
  if (addButton) {
    console.log("Found Add to Cart button, testing...");
    addButton.click();
  } else {
    console.log("No Add to Cart button found");
  }
}

console.log("Run testAddToCart() to test cart functionality");

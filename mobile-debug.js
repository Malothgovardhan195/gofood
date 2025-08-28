// Mobile Debug Test for Login/Signup Issues
// Run this in browser console on mobile device

console.log('🔍 Mobile Debug Test Starting...');

// Test 1: Check if mobile CSS is loaded
const mobileCSS = document.querySelector('link[href*="mobile-responsive"]') || 
                 document.querySelector('style') && 
                 Array.from(document.querySelectorAll('style')).find(s => s.textContent.includes('auth-form'));

console.log('📱 Mobile CSS loaded:', !!mobileCSS);

// Test 2: Check form dimensions
const loginForm = document.querySelector('.auth-form, form');
if (loginForm) {
  const styles = window.getComputedStyle(loginForm);
  console.log('📐 Form width:', styles.width);
  console.log('📐 Form max-width:', styles.maxWidth);
  console.log('📐 Form margin:', styles.margin);
  console.log('📐 Form padding:', styles.padding);
}

// Test 3: Check viewport
console.log('📱 Viewport width:', window.innerWidth);
console.log('📱 Screen width:', screen.width);
console.log('📱 Device pixel ratio:', window.devicePixelRatio);

// Test 4: Check inputs
const inputs = document.querySelectorAll('.form-control');
inputs.forEach((input, i) => {
  const styles = window.getComputedStyle(input);
  console.log(`📝 Input ${i+1} font-size:`, styles.fontSize);
  console.log(`📝 Input ${i+1} padding:`, styles.padding);
});

// Test 5: Check buttons
const buttons = document.querySelectorAll('.btn');
buttons.forEach((btn, i) => {
  const styles = window.getComputedStyle(btn);
  console.log(`🔘 Button ${i+1} width:`, styles.width);
  console.log(`🔘 Button ${i+1} height:`, styles.height);
});

// Test 6: Responsive breakpoints
const mediaQueries = [
  window.matchMedia('(max-width: 768px)'),
  window.matchMedia('(min-width: 768px) and (max-width: 992px)'),
  window.matchMedia('(min-width: 992px)')
];

mediaQueries.forEach((mq, i) => {
  const breakpoints = ['Mobile', 'Tablet', 'Desktop'];
  console.log(`📏 ${breakpoints[i]} breakpoint active:`, mq.matches);
});

console.log('✅ Mobile Debug Test Complete!');
console.log('📋 Copy this output and share if issues persist');

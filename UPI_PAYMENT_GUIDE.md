## UPI Payment Integration Guide

### How the UPI Payment Works:

1. **User Flow:**
   - User adds items to cart
   - Clicks "Pay ₹[amount]" button
   - Selects UPI payment method
   - Enters their UPI ID (e.g., 9876543210@paytm)
   - Clicks "Pay" button
   - Modal opens with UPI app options

2. **UPI App Redirection:**
   - When user clicks on any UPI app button (Google Pay, PhonePe, Paytm, etc.)
   - The app generates a UPI URL with the format:
     ```
     upi://pay?pa=gofood@okaxis&pn=GoFood&am=[amount]&cu=INR&tn=Payment for GoFood Order
     ```
   - Uses `window.location.href` to redirect to the UPI app
   - Each app has specific URL schemes:
     - Google Pay: `tez://upi/pay?...`
     - PhonePe: `phonepe://pay?...`
     - Paytm: `paytmmp://pay?...`
     - Generic UPI: `upi://pay?...`

3. **Payment Completion:**
   - User completes payment in their UPI app
   - Returns to the web application
   - Clicks "Payment Done" button
   - System generates transaction ID and confirms payment
   - Order is processed and cart is cleared

### Testing the UPI Payment:

1. **On Mobile Device:**
   - The UPI URLs will automatically open the respective apps
   - Complete the payment in the app
   - Return to browser and confirm

2. **On Desktop/Laptop:**
   - The UPI URLs will show a "Open app" dialog
   - You can click "Payment Done" to simulate successful payment

### Key Features:

- ✅ Real UPI URL generation
- ✅ Multiple UPI app support (GPay, PhonePe, Paytm, BHIM)
- ✅ Transaction ID generation
- ✅ Payment success animation
- ✅ Order processing integration
- ✅ Cart clearing after successful payment
- ✅ Error handling for invalid UPI IDs

### UPI URL Parameters:

- `pa`: Payee Address (Merchant UPI ID)
- `pn`: Payee Name (Merchant Name)
- `am`: Amount
- `cu`: Currency (INR)
- `tn`: Transaction Note
- `tid`: Transaction ID
- `tr`: Transaction Reference

The implementation now uses a simplified approach that works reliably across different devices and browsers.

import React, { useState } from 'react';

const PaymentGateway = ({ totalAmount, onPaymentSuccess, onPaymentCancel }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    upiId: '',
    phoneNumber: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Global variable to access component functions from modal
  const merchantVPA = "gofood@okaxis";

  const paymentMethods = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      icon: 'fas fa-credit-card',
      description: 'Pay securely with Razorpay',
      color: 'primary'
    },
    {
      id: 'paytm',
      name: 'Paytm',
      icon: 'fas fa-mobile-alt',
      description: 'Pay with Paytm Wallet',
      color: 'info'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: 'fas fa-qrcode',
      description: 'Pay using UPI (PhonePe, GPay, etc.)',
      color: 'success'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'fas fa-credit-card',
      description: 'Pay with your card',
      color: 'warning'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: 'fas fa-university',
      description: 'Pay through your bank',
      color: 'secondary'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: 'fas fa-money-bill-wave',
      description: 'Pay when you receive',
      color: 'dark'
    }
  ];

  const handleInputChange = (field, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const processPayment = async () => {
    setIsProcessing(true);
    
    try {
      if (selectedMethod === 'upi') {
        handleUPIPayment();
        return;
      }
      
      if (selectedMethod === 'paytm') {
        handlePaytmPayment();
        return;
      }
      
      if (selectedMethod === 'razorpay') {
        handleRazorpayPayment();
        return;
      }
      
      if (selectedMethod === 'cod') {
        // For COD, just process the order
        const paymentData = {
          method: 'cod',
          amount: totalAmount,
          timestamp: new Date().toISOString(),
          transactionId: `COD${Date.now()}`,
          status: 'pending'
        };
        onPaymentSuccess(paymentData);
        setIsProcessing(false);
        return;
      }
      
      // For other methods, simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentData = {
        method: selectedMethod,
        amount: totalAmount,
        timestamp: new Date().toISOString(),
        transactionId: `TXN${Date.now()}`,
        status: 'success'
      };

      onPaymentSuccess(paymentData);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUPIPayment = () => {
    const upiId = paymentDetails.upiId;
    
    if (!upiId || !upiId.includes('@')) {
      alert('Please enter a valid UPI ID');
      setIsProcessing(false);
      return;
    }

    // Create UPI payment URL
    const merchantVPA = "gofood@okaxis"; // Your merchant UPI ID
    const merchantName = "GoFood";
    const transactionId = `GOFOOD${Date.now()}`;
    const note = `Payment for GoFood Order #${transactionId}`;
    
    // UPI Intent URL format with proper encoding
    const upiUrl = `upi://pay?pa=${merchantVPA}&pn=${encodeURIComponent(merchantName)}&tid=${transactionId}&tr=${transactionId}&tn=${encodeURIComponent(note)}&am=${totalAmount}&cu=INR&mode=02&purpose=00`;
    
    // Check if it's a mobile device
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Mobile device - show payment options with direct app links
      showMobileUPIOptions(upiUrl, transactionId, upiId);
    } else {
      // Desktop - show QR code and payment options
      showDesktopUPIOptions(upiUrl, transactionId, upiId);
    }
  };

  const showMobileUPIOptions = (upiUrl, transactionId, upiId) => {
    const modal = document.createElement('div');
    modal.className = 'upi-payment-modal';
    modal.innerHTML = `
      <div class="modal fade show" style="display: block; background: rgba(0,0,0,0.8);" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-success text-white">
              <h5 class="modal-title">
                <i class="fas fa-mobile-alt me-2"></i>
                UPI Payment - ₹${totalAmount}
              </h5>
            </div>
            <div class="modal-body text-center">
              <div class="mb-3">
                <p class="text-muted">Choose your preferred UPI app to complete the payment</p>
                <div class="alert alert-info">
                  <i class="fas fa-info-circle me-2"></i>
                  Transaction ID: <strong>${transactionId}</strong>
                </div>
              </div>
              
              <div class="row g-3 mb-4">
                <div class="col-6">
                  <button class="btn btn-primary w-100 upi-app-btn" onclick="openUPIApp('googlepay')">
                    <i class="fab fa-google-pay fa-2x mb-2"></i>
                    <div>Google Pay</div>
                  </button>
                </div>
                <div class="col-6">
                  <button class="btn btn-success w-100 upi-app-btn" onclick="openUPIApp('phonepe')">
                    <i class="fas fa-mobile-alt fa-2x mb-2"></i>
                    <div>PhonePe</div>
                  </button>
                </div>
                <div class="col-6">
                  <button class="btn btn-info w-100 upi-app-btn" onclick="openUPIApp('paytm')">
                    <i class="fas fa-wallet fa-2x mb-2"></i>
                    <div>Paytm</div>
                  </button>
                </div>
                <div class="col-6">
                  <button class="btn btn-warning w-100 upi-app-btn" onclick="openUPIApp('bhim')">
                    <i class="fas fa-university fa-2x mb-2"></i>
                    <div>BHIM UPI</div>
                  </button>
                </div>
              </div>
              
              <div class="payment-status" id="payment-status" style="display: none;">
                <div class="alert alert-warning">
                  <i class="fas fa-clock me-2"></i>
                  Waiting for payment confirmation...
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" onclick="cancelPayment()">
                <i class="fas fa-times me-2"></i>Cancel
              </button>
              <button type="button" class="btn btn-success" onclick="confirmPayment('${transactionId}', '${upiId}')">
                <i class="fas fa-check me-2"></i>Payment Done
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add global functions for modal
    window.openUPIApp = (appType) => {
      document.getElementById('payment-status').style.display = 'block';
      
      let appUrl = upiUrl;
      switch(appType) {
        case 'googlepay':
          appUrl = `tez://upi/pay?pa=${merchantVPA}&pn=GoFood&am=${totalAmount}&cu=INR&tn=Payment for GoFood Order`;
          break;
        case 'phonepe':
          appUrl = `phonepe://pay?pa=${merchantVPA}&pn=GoFood&am=${totalAmount}&cu=INR&tn=Payment for GoFood Order`;
          break;
        case 'paytm':
          appUrl = `paytmmp://pay?pa=${merchantVPA}&pn=GoFood&am=${totalAmount}&cu=INR&tn=Payment for GoFood Order`;
          break;
        case 'bhim':
          appUrl = upiUrl;
          break;
      }
      
      // Try to open the app
      window.location.href = appUrl;
      
      // Show processing message
      setTimeout(() => {
        if (document.getElementById('payment-status')) {
          document.getElementById('payment-status').innerHTML = `
            <div class="alert alert-info">
              <i class="fas fa-mobile-alt me-2"></i>
              If the app didn't open, click "Payment Done" after completing payment manually
            </div>
          `;
        }
      }, 2000);
    };
    
    window.confirmPayment = (txnId, upiId) => {
      const paymentData = {
        method: 'upi',
        upiId: upiId,
        amount: totalAmount,
        timestamp: new Date().toISOString(),
        transactionId: txnId,
        status: 'success'
      };
      
      // Show success message
      modal.innerHTML = `
        <div class="modal fade show" style="display: block; background: rgba(0,0,0,0.8);" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-body text-center py-5">
                <div class="mb-4">
                  <i class="fas fa-check-circle fa-5x text-success"></i>
                </div>
                <h4 class="text-success mb-3">Payment Successful!</h4>
                <p class="text-muted mb-3">Transaction ID: <strong>${txnId}</strong></p>
                <p class="text-muted">Amount Paid: <strong>₹${totalAmount}</strong></p>
                <div class="mt-4">
                  <button class="btn btn-success btn-lg" onclick="closeModal()">
                    <i class="fas fa-arrow-right me-2"></i>Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      setTimeout(() => {
        onPaymentSuccess(paymentData);
        modal.remove();
        setIsProcessing(false);
      }, 2000);
    };
    
    window.cancelPayment = () => {
      modal.remove();
      setIsProcessing(false);
    };
    
    window.closeModal = () => {
      modal.remove();
    };
  };

  const showDesktopUPIOptions = (upiUrl, transactionId, upiId) => {
    const modal = document.createElement('div');
    modal.className = 'upi-payment-modal';
    modal.innerHTML = `
      <div class="modal fade show" style="display: block; background: rgba(0,0,0,0.8);" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-success text-white">
              <h5 class="modal-title">
                <i class="fas fa-qrcode me-2"></i>
                UPI Payment - ₹${totalAmount}
              </h5>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6 text-center">
                  <h6>Scan QR Code</h6>
                  <div class="qr-code-container">
                    <div id="qr-code-display" class="mb-3"></div>
                    <p class="small text-muted">Scan with any UPI app</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <h6>Or Choose UPI App</h6>
                  <div class="row g-2">
                    <div class="col-6">
                      <button class="btn btn-primary w-100 mb-2" onclick="openWebUPI('googlepay')">
                        <i class="fab fa-google-pay me-2"></i>Google Pay
                      </button>
                    </div>
                    <div class="col-6">
                      <button class="btn btn-success w-100 mb-2" onclick="openWebUPI('phonepe')">
                        <i class="fas fa-mobile-alt me-2"></i>PhonePe
                      </button>
                    </div>
                    <div class="col-6">
                      <button class="btn btn-info w-100 mb-2" onclick="openWebUPI('paytm')">
                        <i class="fas fa-wallet me-2"></i>Paytm
                      </button>
                    </div>
                    <div class="col-6">
                      <button class="btn btn-warning w-100 mb-2" onclick="openWebUPI('bhim')">
                        <i class="fas fa-university me-2"></i>BHIM
                      </button>
                    </div>
                  </div>
                  
                  <div class="mt-3">
                    <div class="alert alert-info">
                      <i class="fas fa-info-circle me-2"></i>
                      <strong>Transaction Details:</strong><br>
                      ID: ${transactionId}<br>
                      Amount: ₹${totalAmount}<br>
                      UPI ID: ${upiId}
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="payment-status mt-3" id="payment-status" style="display: none;">
                <div class="alert alert-warning text-center">
                  <i class="fas fa-clock me-2"></i>
                  Waiting for payment confirmation...
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" onclick="cancelPayment()">
                <i class="fas fa-times me-2"></i>Cancel
              </button>
              <button type="button" class="btn btn-success" onclick="confirmPayment('${transactionId}', '${upiId}')">
                <i class="fas fa-check me-2"></i>Payment Completed
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Generate QR code (you can use a QR code library here)
    generateQRCode(upiUrl);
    
    // Add global functions
    window.openWebUPI = (appType) => {
      document.getElementById('payment-status').style.display = 'block';
      
      let webUrl = '';
      switch(appType) {
        case 'googlepay':
          webUrl = `https://pay.google.com/pay?${new URLSearchParams({
            pa: 'gofood@okaxis',
            pn: 'GoFood',
            am: totalAmount,
            cu: 'INR',
            tn: `Payment for GoFood Order #${transactionId}`
          })}`;
          break;
        case 'phonepe':
          webUrl = `https://www.phonepe.com/pay?${new URLSearchParams({
            pa: 'gofood@okaxis',
            pn: 'GoFood',
            am: totalAmount,
            cu: 'INR'
          })}`;
          break;
        case 'paytm':
          webUrl = `https://paytm.com/pay?${new URLSearchParams({
            pa: 'gofood@okaxis',
            pn: 'GoFood',
            am: totalAmount,
            cu: 'INR'
          })}`;
          break;
        default:
          webUrl = upiUrl;
      }
      
      window.open(webUrl, '_blank', 'width=800,height=600');
    };
    
    window.confirmPayment = (txnId, upiId) => {
      const paymentData = {
        method: 'upi',
        upiId: upiId,
        amount: totalAmount,
        timestamp: new Date().toISOString(),
        transactionId: txnId,
        status: 'success'
      };
      
      // Show success animation
      modal.innerHTML = `
        <div class="modal fade show" style="display: block; background: rgba(0,0,0,0.8);" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-body text-center py-5">
                <div class="success-animation mb-4">
                  <i class="fas fa-check-circle fa-5x text-success"></i>
                </div>
                <h3 class="text-success mb-3">🎉 Payment Successful!</h3>
                <div class="alert alert-success">
                  <strong>Transaction Completed</strong><br>
                  ID: ${txnId}<br>
                  Amount: ₹${totalAmount}<br>
                  Method: UPI (${upiId})
                </div>
                <p class="text-muted">Your order is being processed...</p>
                <div class="progress mb-3">
                  <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" 
                       style="width: 100%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      setTimeout(() => {
        onPaymentSuccess(paymentData);
        modal.remove();
        setIsProcessing(false);
      }, 3000);
    };
    
    window.cancelPayment = () => {
      modal.remove();
      setIsProcessing(false);
    };
  };

  const generateQRCode = (upiUrl) => {
    // Simple QR code representation (in real app, use qrcode.js library)
    const qrDiv = document.getElementById('qr-code-display');
    if (qrDiv) {
      qrDiv.innerHTML = `
        <div class="border border-success p-3 bg-white" style="max-width: 200px; margin: 0 auto;">
          <div class="text-center">
            <i class="fas fa-qrcode fa-5x text-success mb-2"></i>
            <div class="small text-muted" style="word-break: break-all; font-size: 8px;">
              ${upiUrl.substring(0, 50)}...
            </div>
          </div>
        </div>
        <p class="mt-2 small text-muted">
          <i class="fas fa-mobile-alt me-1"></i>
          Open your UPI app and scan this QR code
        </p>
      `;
    }
  };

  const handlePaytmPayment = () => {
    const phoneNumber = paymentDetails.phoneNumber;
    
    if (!phoneNumber || phoneNumber.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      setIsProcessing(false);
      return;
    }

    // Paytm payment URL (in real implementation, you'd get this from your backend)
    const paytmUrl = `https://securegw.paytm.in/theia/api/v1/showPaymentPage?mid=YOUR_MID&orderId=ORDER${Date.now()}`;
    
    // Open Paytm in new window
    const paytmWindow = window.open(paytmUrl, 'paytm_payment', 'width=800,height=600');
    
    // Monitor the payment window
    const checkClosed = setInterval(() => {
      if (paytmWindow.closed) {
        clearInterval(checkClosed);
        const userChoice = window.confirm('Did you complete the payment on Paytm? Click OK if payment was successful.');
        if (userChoice) {
          const paymentData = {
            method: 'paytm',
            phoneNumber: phoneNumber,
            amount: totalAmount,
            timestamp: new Date().toISOString(),
            transactionId: `PTM${Date.now()}`,
            status: 'success'
          };
          onPaymentSuccess(paymentData);
        }
        setIsProcessing(false);
      }
    }, 1000);
  };

  const handleRazorpayPayment = () => {
    // In a real implementation, you would load Razorpay SDK
    if (typeof window.Razorpay === 'undefined') {
      // Load Razorpay script dynamically
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => initializeRazorpay();
      document.head.appendChild(script);
    } else {
      initializeRazorpay();
    }
  };

  const initializeRazorpay = () => {
    const options = {
      key: 'YOUR_RAZORPAY_KEY', // Replace with your Razorpay key
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
      name: 'GoFood',
      description: 'Food Order Payment',
      order_id: `order_${Date.now()}`, // This should come from your backend
      handler: function (response) {
        const paymentData = {
          method: 'razorpay',
          amount: totalAmount,
          timestamp: new Date().toISOString(),
          transactionId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          status: 'success'
        };
        onPaymentSuccess(paymentData);
        setIsProcessing(false);
      },
      prefill: {
        email: localStorage.getItem('userEmail') || '',
        contact: paymentDetails.phoneNumber || ''
      },
      theme: {
        color: '#28a745'
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'card':
        return (
          <div className="payment-form mt-3">
            <h6>Card Details</h6>
            <div className="row g-3">
              <div className="col-12">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Card Holder Name"
                  value={paymentDetails.cardHolder}
                  onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                />
              </div>
              <div className="col-12">
                <input
                  type="text"
                  className="form-control"
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  value={paymentDetails.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                />
              </div>
              <div className="col-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="MM/YY"
                  maxLength="5"
                  value={paymentDetails.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                />
              </div>
              <div className="col-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="CVV"
                  maxLength="3"
                  value={paymentDetails.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 'upi':
        return (
          <div className="payment-form mt-3">
            <h6>UPI Payment</h6>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">UPI ID</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter UPI ID (e.g., yourname@paytm)"
                  value={paymentDetails.upiId}
                  onChange={(e) => handleInputChange('upiId', e.target.value)}
                  pattern="[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-_]{2,64}"
                />
                <div className="form-text">
                  Enter your UPI ID (e.g., 9876543210@paytm, user@googlepay)
                </div>
              </div>
              <div className="col-12">
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>How UPI Payment Works:</strong>
                  <ul className="mb-0 mt-2">
                    <li>On mobile: You'll be redirected to your UPI app</li>
                    <li>On desktop: You'll get QR code and app links</li>
                    <li>Supported apps: GPay, PhonePe, Paytm, BHIM, etc.</li>
                  </ul>
                </div>
              </div>
              <div className="col-12">
                <div className="row g-2">
                  <div className="col-3 text-center">
                    <i className="fab fa-google-pay fa-2x text-primary"></i>
                    <div><small>GPay</small></div>
                  </div>
                  <div className="col-3 text-center">
                    <i className="fas fa-mobile-alt fa-2x text-success"></i>
                    <div><small>PhonePe</small></div>
                  </div>
                  <div className="col-3 text-center">
                    <i className="fas fa-wallet fa-2x text-info"></i>
                    <div><small>Paytm</small></div>
                  </div>
                  <div className="col-3 text-center">
                    <i className="fas fa-university fa-2x text-warning"></i>
                    <div><small>BHIM</small></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'paytm':
        return (
          <div className="payment-form mt-3">
            <h6>Paytm Payment</h6>
            <div className="row g-3">
              <div className="col-12">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Mobile Number"
                  value={paymentDetails.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                />
              </div>
              <div className="col-12">
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  You'll be redirected to Paytm to complete the payment
                </div>
              </div>
            </div>
          </div>
        );

      case 'cod':
        return (
          <div className="payment-form mt-3">
            <div className="alert alert-warning">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <strong>Cash on Delivery</strong><br/>
              You can pay ₹{totalAmount} when your order is delivered.
              Please keep exact change ready.
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="payment-gateway">
      <div className="card">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">
            <i className="fas fa-lock me-2"></i>
            Secure Payment - ₹{totalAmount}
          </h5>
        </div>
        <div className="card-body">
          <h6 className="mb-3">Choose Payment Method:</h6>
          
          <div className="row g-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="col-md-6">
                <div 
                  className={`card payment-method-card ${selectedMethod === method.id ? 'selected' : ''}`}
                  onClick={() => setSelectedMethod(method.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card-body text-center">
                    <i className={`${method.icon} fa-2x text-${method.color} mb-2`}></i>
                    <h6 className="card-title">{method.name}</h6>
                    <p className="card-text small text-muted">{method.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedMethod && renderPaymentForm()}

          {selectedMethod && (
            <div className="d-flex justify-content-between mt-4">
              <button 
                className="btn btn-secondary"
                onClick={onPaymentCancel}
                disabled={isProcessing}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Cancel
              </button>
              <button 
                className="btn btn-success"
                onClick={processPayment}
                disabled={isProcessing || !selectedMethod}
              >
                {isProcessing ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock me-2"></i>
                    Pay ₹{totalAmount}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 text-center">
        <small className="text-muted">
          <i className="fas fa-shield-alt me-1"></i>
          Your payment information is secure and encrypted
        </small>
      </div>

      <style jsx>{`
        .payment-method-card {
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        
        .payment-method-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .payment-method-card.selected {
          border-color: #28a745;
          background-color: #f8fff9;
        }
        
        .payment-form {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          border: 1px solid #dee2e6;
        }
        
        .upi-apps {
          display: flex;
          justify-content: space-around;
          margin-top: 15px;
        }
        
        .upi-app {
          text-align: center;
          padding: 10px;
          border-radius: 8px;
          transition: background-color 0.3s;
        }
        
        .upi-app:hover {
          background-color: #e9ecef;
        }
        
        .modal {
          z-index: 1050;
        }
        
        .qr-code-container {
          background: white;
          border: 2px solid #28a745;
          border-radius: 10px;
          padding: 20px;
          margin: 20px auto;
          max-width: 300px;
        }
        
        .upi-app-btn {
          padding: 15px 10px;
          height: 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .upi-app-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        .success-animation {
          animation: successPulse 1s ease-in-out;
        }
        
        @keyframes successPulse {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .upi-payment-modal .modal-content {
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        
        .upi-payment-modal .modal-header {
          border-radius: 15px 15px 0 0;
        }
      `}</style>
    </div>
  );
};

export default PaymentGateway;

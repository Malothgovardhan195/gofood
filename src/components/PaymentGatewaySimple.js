import React, { useState } from 'react';

const PaymentGatewaySimple = ({ totalAmount, onPaymentSuccess, onPaymentCancel }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    phoneNumber: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: 'fas fa-qrcode',
      description: 'Pay using UPI (PhonePe, GPay, etc.)',
      color: 'success'
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
    if (selectedMethod === 'upi') {
      handleUPIPayment();
    } else if (selectedMethod === 'cod') {
      handleCODPayment();
    }
  };

  const handleUPIPayment = () => {
    const upiId = paymentDetails.upiId;
    
    if (!upiId || !upiId.includes('@')) {
      alert('Please enter a valid UPI ID (e.g., yourname@paytm)');
      return;
    }

    setIsProcessing(true);
    setShowUPIModal(true);
  };

  const handleCODPayment = () => {
    const paymentData = {
      method: 'cod',
      amount: totalAmount,
      timestamp: new Date().toISOString(),
      transactionId: `COD${Date.now()}`,
      status: 'pending'
    };
    onPaymentSuccess(paymentData);
  };

  const openUPIApp = (appType) => {
    const merchantVPA = "gofood@okaxis";
    const transactionId = `GOFOOD${Date.now()}`;
    const note = encodeURIComponent(`Payment for GoFood Order #${transactionId}`);
    
    let upiUrl = '';
    let fallbackUrl = '';
    
    switch(appType) {
      case 'googlepay':
        upiUrl = `tez://upi/pay?pa=${merchantVPA}&pn=GoFood&am=${totalAmount}&cu=INR&tn=${note}`;
        fallbackUrl = `https://pay.google.com/pay?pa=${merchantVPA}&pn=GoFood&am=${totalAmount}&cu=INR&tn=${note}`;
        break;
      case 'phonepe':
        upiUrl = `phonepe://pay?pa=${merchantVPA}&pn=GoFood&am=${totalAmount}&cu=INR&tn=${note}`;
        fallbackUrl = `https://www.phonepe.com/pay?pa=${merchantVPA}&pn=GoFood&am=${totalAmount}&cu=INR&tn=${note}`;
        break;
      case 'paytm':
        upiUrl = `paytmmp://pay?pa=${merchantVPA}&pn=GoFood&am=${totalAmount}&cu=INR&tn=${note}`;
        fallbackUrl = `https://paytm.com/pay?pa=${merchantVPA}&pn=GoFood&am=${totalAmount}&cu=INR&tn=${note}`;
        break;
      case 'generic':
        upiUrl = `upi://pay?pa=${merchantVPA}&pn=GoFood&am=${totalAmount}&cu=INR&tn=${note}`;
        fallbackUrl = upiUrl;
        break;
      default:
        upiUrl = `upi://pay?pa=${merchantVPA}&pn=GoFood&am=${totalAmount}&cu=INR&tn=${note}`;
        fallbackUrl = upiUrl;
    }

    console.log('Attempting to open UPI URL:', upiUrl);
    
    // Try multiple methods to open the UPI app
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Method 1: Direct redirect
      try {
        window.location.href = upiUrl;
        
        // Method 2: Create a temporary link and click it
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = upiUrl;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, 500);
        
        // Method 3: Show confirmation after delay
        setTimeout(() => {
          setConfirmMessage(
            `UPI App Opening...\n\n` +
            `URL: ${upiUrl}\n\n` +
            `If the app didn't open:\n` +
            `1. Copy the URL above\n` +
            `2. Open your UPI app manually\n` +
            `3. Use the URL to complete payment\n\n` +
            `Click "Payment Done" if payment was successful.`
          );
          setShowConfirmDialog(true);
        }, 3000);
        
      } catch (error) {
        console.error('Error opening UPI app:', error);
        alert(`Error opening UPI app. Please try manually:\n${upiUrl}`);
      }
    } else {
      // Desktop - try to open in new window/tab
      try {
        const newWindow = window.open(upiUrl, '_blank');
        
        // If popup was blocked or failed, show the URL
        if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
          setTimeout(() => {
            alert(
              `Please copy this UPI URL and open it in your mobile:\n\n${upiUrl}\n\n` +
              `Or scan QR code with your UPI app.`
            );
          }, 500);
        }
        
        // Also try fallback URL
        setTimeout(() => {
          window.open(fallbackUrl, '_blank');
        }, 1000);
        
      } catch (error) {
        console.error('Error opening UPI URL:', error);
        alert(`UPI URL: ${upiUrl}\n\nPlease copy and use this URL in your UPI app.`);
      }
    }
  };

  const confirmPayment = () => {
    const transactionId = `GOFOOD${Date.now()}`;
    const paymentData = {
      method: 'upi',
      upiId: paymentDetails.upiId,
      amount: totalAmount,
      timestamp: new Date().toISOString(),
      transactionId: transactionId,
      status: 'success'
    };
    
    setShowUPIModal(false);
    setIsProcessing(false);
    
    // Show success message
    alert(`✅ Payment Successful!\nTransaction ID: ${transactionId}\nAmount: ₹${totalAmount}`);
    
    onPaymentSuccess(paymentData);
  };

  const cancelPayment = () => {
    setShowUPIModal(false);
    setIsProcessing(false);
  };

  const showQRCode = () => {
    const merchantVPA = "gofood@okaxis";
    const transactionId = `GOFOOD${Date.now()}`;
    const note = encodeURIComponent(`Payment for GoFood Order #${transactionId}`);
    const upiUrl = `upi://pay?pa=${merchantVPA}&pn=GoFood&am=${totalAmount}&cu=INR&tn=${note}`;
    
    alert(
      `📱 QR Code Information:\n\n` +
      `UPI URL: ${upiUrl}\n\n` +
      `Instructions:\n` +
      `1. Open any UPI app on your phone\n` +
      `2. Select "Scan QR Code" option\n` +
      `3. Scan the QR code displayed on screen\n` +
      `4. Complete the payment\n\n` +
      `Note: In a real implementation, this would show an actual QR code image.`
    );
  };

  const renderPaymentForm = () => {
    if (selectedMethod === 'upi') {
      return (
        <div className="payment-form mt-3">
          <h6>UPI Payment</h6>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">Enter your UPI ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="yourname@paytm, 9876543210@okaxis"
                value={paymentDetails.upiId}
                onChange={(e) => handleInputChange('upiId', e.target.value)}
              />
              <div className="form-text">
                Examples: 9876543210@paytm, username@googlepay, yourname@okaxis
              </div>
            </div>
            <div className="col-12">
              <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                <strong>How it works:</strong>
                <ol className="mb-0 mt-2">
                  <li>Enter your UPI ID above</li>
                  <li>Click "Pay ₹{totalAmount}" button</li>
                  <li>Choose your UPI app (GPay, PhonePe, Paytm, etc.)</li>
                  <li>Complete payment in the app</li>
                  <li>Return here and click "Payment Done"</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
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
                <i className="fas fa-lock me-2"></i>
                Pay ₹{totalAmount}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* UPI Payment Modal */}
      {showUPIModal && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  <i className="fas fa-mobile-alt me-2"></i>
                  UPI Payment - ₹{totalAmount}
                </h5>
              </div>
              <div className="modal-body text-center">
                <div className="mb-3">
                  <p>Choose your preferred payment method:</p>
                  <div className="alert alert-info">
                    <strong>UPI ID:</strong> {paymentDetails.upiId}<br/>
                    <strong>Amount:</strong> ₹{totalAmount}
                  </div>
                </div>
                
                {/* Mobile Device Detection */}
                <div className="mb-3">
                  <div className="badge bg-primary">
                    {/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                      ? '📱 Mobile Device Detected' 
                      : '💻 Desktop Browser'}
                  </div>
                </div>
                
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <button 
                      className="btn btn-primary w-100 py-3 upi-btn"
                      onClick={() => openUPIApp('googlepay')}
                    >
                      <i className="fab fa-google-pay fa-2x mb-2 d-block"></i>
                      Google Pay
                    </button>
                  </div>
                  <div className="col-6">
                    <button 
                      className="btn btn-success w-100 py-3 upi-btn"
                      onClick={() => openUPIApp('phonepe')}
                    >
                      <i className="fas fa-mobile-alt fa-2x mb-2 d-block"></i>
                      PhonePe
                    </button>
                  </div>
                  <div className="col-6">
                    <button 
                      className="btn btn-info w-100 py-3 upi-btn"
                      onClick={() => openUPIApp('paytm')}
                    >
                      <i className="fas fa-wallet fa-2x mb-2 d-block"></i>
                      Paytm
                    </button>
                  </div>
                  <div className="col-6">
                    <button 
                      className="btn btn-warning w-100 py-3 upi-btn"
                      onClick={() => openUPIApp('generic')}
                    >
                      <i className="fas fa-qrcode fa-2x mb-2 d-block"></i>
                      Any UPI App
                    </button>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="mb-3">
                  <button 
                    className="btn btn-outline-secondary w-100"
                    onClick={() => showQRCode()}
                  >
                    <i className="fas fa-qrcode me-2"></i>
                    Show QR Code for Scanning
                  </button>
                </div>

                {/* Manual UPI URL */}
                <div className="accordion mb-3">
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button 
                        className="accordion-button collapsed" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#manualUPI"
                      >
                        <i className="fas fa-link me-2"></i>
                        Manual UPI URL (Advanced)
                      </button>
                    </h2>
                    <div id="manualUPI" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <div className="form-control" style={{wordBreak: 'break-all', fontSize: '12px'}}>
                          upi://pay?pa=gofood@okaxis&pn=GoFood&am={totalAmount}&cu=INR&tn=Payment for GoFood Order
                        </div>
                        <small className="text-muted">Copy this URL and open in any UPI app</small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="alert alert-warning">
                  <i className="fas fa-info-circle me-2"></i>
                  After completing payment, click "Payment Done" below
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={cancelPayment}
                >
                  <i className="fas fa-times me-2"></i>Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={confirmPayment}
                >
                  <i className="fas fa-check me-2"></i>Payment Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
        
        .modal {
          z-index: 1050;
        }
        
        .upi-btn {
          transition: all 0.3s ease;
        }
        
        .upi-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        .upi-btn:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};

export default PaymentGatewaySimple;

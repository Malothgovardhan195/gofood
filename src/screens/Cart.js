import React, { useState } from 'react'
import Delete from '@mui/icons-material/Delete'
import { useCart, useDispatchCart } from '../components/ContextReducer';
import PaymentGatewayClean from '../components/PaymentGatewayClean';
import { mockApiService, USE_MOCK_DATA } from '../services/mockApi';

export default function Cart() {
  let data = useCart();
  let dispatch = useDispatchCart();
  const [isLoading, setIsLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);

  if (data.length === 0) {
    return (
      <div>
        <div className='m-5 w-100 text-center fs-3'>
          <div className='alert alert-info'>
            <i className="fas fa-shopping-cart fa-3x mb-3"></i>
            <h3>The Cart is Empty!</h3>
            <p>Add some delicious items to your cart to get started.</p>
          </div>
        </div>
      </div>
    )
  }

  const totalPrice = data.reduce((total, food) => total + food.price, 0);
  const deliveryFee = totalPrice > 500 ? 0 : 40;
  const finalTotal = totalPrice + deliveryFee;

  const handlePaymentSuccess = async (paymentData) => {
    let userEmail = localStorage.getItem("userEmail");
    
    setIsLoading(true);
    setOrderStatus('');

    try {
      let response;
      
      if (USE_MOCK_DATA) {
        // Use mock API for production deployment
        response = await mockApiService.orderData({
          order_data: data,
          email: userEmail,
          order_date: new Date().toDateString(),
          payment_info: paymentData
        });
        
        if (response.success) {
          setOrderStatus('success');
          dispatch({ type: "DROP" });
          setShowPayment(false);
          alert(`Payment successful! Order ID: ${response.orderId} (Demo Mode)`);
        } else {
          throw new Error('Order failed');
        }
      } else {
        // Use real API for local development
        response = await fetch("http://localhost:5000/api/auth/orderData", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            order_data: data,
            email: userEmail,
            order_date: new Date().toDateString(),
            payment_info: paymentData
          })
        });

        if (response.ok) {
          setOrderStatus('success');
          dispatch({ type: "DROP" });
          setShowPayment(false);
          alert(`Payment successful! Transaction ID: ${paymentData.transactionId}`);
        } else {
          throw new Error('Order failed');
        }
      }
    } catch (error) {
      console.error('Order failed:', error);
      setOrderStatus('error');
      alert('Order failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    let userEmail = localStorage.getItem("userEmail");
    
    if (!userEmail) {
      setOrderStatus('error');
      alert('Please login to place an order');
      return;
    }

    setOrderTotal(finalTotal);
    setShowPayment(true);
  };

  if (showPayment) {
    return (
      <div className="container my-4">
        <PaymentGatewayClean
          totalAmount={orderTotal}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentCancel={() => setShowPayment(false)}
        />
      </div>
    );
  }
  return (
    <div>
      {console.log(data)}
      
      {/* Order Status Messages */}
      {orderStatus === 'success' && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          <strong>Order Placed Successfully!</strong> Thank you for your order.
        </div>
      )}
      
      {orderStatus === 'error' && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          <strong>Order Failed!</strong> Please try again later.
        </div>
      )}

      <div className='container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md' >
        <table className='table table-hover table-striped'>
          <thead className='text-success fs-4 bg-light'>
            <tr>
              <th scope='col' className='text-center'>#</th>
              <th scope='col'>Name</th>
              <th scope='col' className='text-center'>Quantity</th>
              <th scope='col' className='text-center'>Option</th>
              <th scope='col' className='text-center'>Amount</th>
              <th scope='col' className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((food, index) => (
              <tr key={index}>
                <th scope='row' className='text-center align-middle'>{index + 1}</th>
                <td className='align-middle'>
                  <strong>{food.name}</strong>
                </td>
                <td className='text-center align-middle'>
                  <span className='badge bg-primary'>{food.qty}</span>
                </td>
                <td className='text-center align-middle'>
                  <span className='badge bg-secondary'>{food.size}</span>
                </td>
                <td className='text-center align-middle'>
                  <strong className='text-success'>₹{food.price}/-</strong>
                </td>
                <td className='text-center align-middle'>
                  <button 
                    type="button" 
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => { dispatch({ type: "REMOVE", index: index }) }}
                    title="Remove item"
                  >
                    <Delete fontSize="small" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className='row justify-content-between align-items-center mt-4'>
          <div className='col-md-8'>
            <div className="card bg-light">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span>₹{totalPrice}/-</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Delivery Fee:</span>
                  <span className={deliveryFee === 0 ? "text-success" : ""}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}/-`}
                  </span>
                </div>
                {deliveryFee === 0 && (
                  <small className="text-muted">Free delivery on orders above ₹500</small>
                )}
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong className='text-success'>₹{finalTotal}/-</strong>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-4 text-md-end mt-3 mt-md-0'>
            <button 
              className='btn btn-success btn-lg px-4 py-2 w-100' 
              onClick={handleCheckOut}
              disabled={data.length === 0 || isLoading}
            > 
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-credit-card me-2"></i>
                  Pay ₹{finalTotal}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

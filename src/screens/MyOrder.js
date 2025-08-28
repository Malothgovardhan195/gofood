import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { mockApiService, USE_MOCK_DATA } from '../services/mockApi';

export default function MyOrder() {
    const [orderData, setOrderData] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchMyOrder = async () => {
        try {
            setLoading(true);
            const email = localStorage.getItem('userEmail');
            
            if (!email) {
                console.error("No user email found");
                setLoading(false);
                return;
            }

            console.log("Fetching orders for:", email);

            const response = await fetch("http://localhost:5000/api/auth/myOrderData", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Received order data:", data);
            
            setOrderData(data.orderData || {});
        } catch (error) {
            console.error("Error fetching order data:", error);
            setOrderData({});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyOrder();
    }, []);

    return (
        <div>
            <Navbar />

            <div className='container'>
                <div className='row'>
                    {loading ? (
                        <div className="text-center mt-5">
                            <div className="spinner-border text-success" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <h5 className="mt-3">Loading your orders...</h5>
                        </div>
                    ) : orderData && orderData.order_data && orderData.order_data.length > 0 ? (
                        orderData.order_data.slice(0).reverse().map((item, index) => (
                            <div key={index} className="w-100">
                                {item.map((arrayData, i) => (
                                    <div key={i}>
                                        {arrayData.Order_date ? (
                                            <div className='m-auto mt-5'>
                                                <div className="alert alert-success">
                                                    <h4><i className="fas fa-calendar-alt me-2"></i>Order Date: {arrayData.Order_date}</h4>
                                                </div>
                                                <hr />
                                            </div>
                                        ) : (
                                            <div className='col-12 col-md-6 col-lg-3 d-inline-block'>
                                                <div className="card mt-3 shadow-sm" style={{ width: "16rem", maxHeight: "400px" }}>
                                                    <img 
                                                        src={arrayData.img} 
                                                        className="card-img-top" 
                                                        alt={arrayData.name} 
                                                        style={{ height: "140px", objectFit: "cover" }} 
                                                    />
                                                    <div className="card-body">
                                                        <h5 className="card-title">{arrayData.name}</h5>
                                                        <div className='container w-100 p-0' style={{ height: "60px" }}>
                                                            <div className="row">
                                                                <div className="col-6">
                                                                    <span className='badge bg-primary'>Qty: {arrayData.qty}</span>
                                                                </div>
                                                                <div className="col-6">
                                                                    <span className='badge bg-secondary'>Size: {arrayData.size}</span>
                                                                </div>
                                                            </div>
                                                            <div className='mt-2'>
                                                                <strong className='text-success fs-5'>₹{arrayData.price}/-</strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="text-center mt-5">
                            <div className="alert alert-info">
                                <i className="fas fa-shopping-bag fa-3x mb-3"></i>
                                <h4>No Orders Found</h4>
                                <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

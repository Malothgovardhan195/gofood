import React, { useState, useEffect } from 'react';

export default function OrderAnalytics() {
    const [analytics, setAnalytics] = useState({
        totalOrders: 0,
        totalSpent: 0,
        favoriteItem: '',
        averageOrderValue: 0,
        monthlyOrders: []
    });

    const fetchAnalytics = async () => {
        try {
            const email = localStorage.getItem('userEmail');
            const response = await fetch("http://localhost:5000/api/auth/myOrderData", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (data.orderData && data.orderData.order_data) {
                calculateAnalytics(data.orderData.order_data);
            }
        } catch (error) {
            console.error("Error fetching analytics:", error);
        }
    };

    const calculateAnalytics = (orderData) => {
        let totalSpent = 0;
        let totalOrders = orderData.length;
        let itemCounts = {};

        orderData.forEach(order => {
            order.forEach(item => {
                if (!item.Order_date) {
                    totalSpent += item.price;
                    itemCounts[item.name] = (itemCounts[item.name] || 0) + 1;
                }
            });
        });

        const favoriteItem = Object.keys(itemCounts).reduce((a, b) => 
            itemCounts[a] > itemCounts[b] ? a : b, ''
        );

        setAnalytics({
            totalOrders,
            totalSpent,
            favoriteItem,
            averageOrderValue: totalOrders > 0 ? (totalSpent / totalOrders) : 0,
            monthlyOrders: [] // Could be enhanced with monthly breakdown
        });
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    return (
        <div className="container my-4">
            <h3 className="mb-4">
                <i className="fas fa-chart-bar me-2"></i>
                Your Order Analytics
            </h3>
            
            <div className="row g-4">
                <div className="col-md-3">
                    <div className="card text-center h-100">
                        <div className="card-body">
                            <i className="fas fa-shopping-cart fa-3x text-primary mb-3"></i>
                            <h4 className="card-title">{analytics.totalOrders}</h4>
                            <p className="card-text">Total Orders</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card text-center h-100">
                        <div className="card-body">
                            <i className="fas fa-rupee-sign fa-3x text-success mb-3"></i>
                            <h4 className="card-title">₹{analytics.totalSpent}</h4>
                            <p className="card-text">Total Spent</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card text-center h-100">
                        <div className="card-body">
                            <i className="fas fa-heart fa-3x text-danger mb-3"></i>
                            <h5 className="card-title">{analytics.favoriteItem}</h5>
                            <p className="card-text">Favorite Item</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card text-center h-100">
                        <div className="card-body">
                            <i className="fas fa-calculator fa-3x text-warning mb-3"></i>
                            <h4 className="card-title">₹{analytics.averageOrderValue.toFixed(0)}</h4>
                            <p className="card-text">Avg Order Value</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

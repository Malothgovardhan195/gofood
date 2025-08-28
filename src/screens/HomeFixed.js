import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { mockApiService, USE_MOCK_DATA } from '../services/mockApi';
import API_BASE_URL from '../config/api';

export default function Home() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState('');

  const loadFoodItems = async () => {
    try {
      if (USE_MOCK_DATA) {
        // Use mock data when no backend URL is configured
        console.log("🔧 Using mock data - no backend URL configured");
        const data = await mockApiService.getFoodData();
        setFoodItems(data[0]);
        setFoodCat(data[1]);
      } else {
        // Use real API (either localhost or deployed backend)
        const apiUrl = API_BASE_URL || 'http://localhost:5000';
        console.log(`🔗 Connecting to backend: ${apiUrl}`);
        
        let response = await fetch(`${apiUrl}/api/auth/foodData`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Failed to fetch');

        let data = await response.json();
        setFoodItems(data[0]);
        setFoodCat(data[1]);
        console.log(`📦 Loaded ${data[0]?.length || 0} food items from backend`);
      }
    } catch (error) {
      console.error("Error loading food items:", error);
      // Fallback to mock data if API fails
      const data = await mockApiService.getFoodData();
      setFoodItems(data[0]);
      setFoodCat(data[1]);
    }
  };

  useEffect(() => {
    loadFoodItems();
  }, []);

  return (
    <div>
      <Navbar />
      
      {/* Enhanced Search Section */}
      <div className="container-fluid bg-dark text-white py-5" style={{ marginTop: "56px" }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="display-4 fw-bold mb-3">
                <i className="fas fa-leaf text-success me-2"></i>
                Delicious Vegetarian Food
              </h1>
              <p className="lead mb-4">
                Order fresh, healthy, and tasty vegetarian meals delivered right to your door!
              </p>
            </div>
            <div className="col-md-4">
              <div className="card search-filter-card p-4">
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <i className="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for food..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => setSearch('')}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Food Categories & Items */}
      <div className='container my-4'>
        {foodCat.length > 0 ? foodCat.map((data, catIndex) => {
          const filteredItems = foodItems.filter(item => 
            item.CategoryName === data.CategoryName && 
            item.name.toLowerCase().includes(search.toLowerCase())
          );
          
          if (filteredItems.length === 0 && search) return null;
          
          return (
            <div key={catIndex} className='row mb-5'>
              <div className='col-12'>
                <h2 className='fs-2 mb-3 text-center text-md-start'>
                  <i className="fas fa-utensils text-success me-2"></i>
                  {data.CategoryName}
                  <span className="badge bg-success ms-2">{filteredItems.length}</span>
                </h2>
                <hr className="mb-4" style={{ 
                  height: "3px", 
                  background: "linear-gradient(to right, #28a745, #20c997)" 
                }} />
              </div>

              {filteredItems.length > 0 ? (
                filteredItems.map((filteredItem, itemIndex) => (
                  <div key={itemIndex} className='col-12 col-md-6 col-lg-3 mb-4'>
                    <Card 
                      foodName={filteredItem.name} 
                      item={filteredItem} 
                      options={filteredItem.options[0]} 
                      ImgSrc={filteredItem.img} 
                    />
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-4">
                  <i className="fas fa-search fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No items found in this category</p>
                </div>
              )}
            </div>
          );
        }) : (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading delicious food items...</p>
          </div>
        )}

        {/* No Results Message */}
        {foodCat.length > 0 && foodItems.length > 0 && search &&
         foodCat.every(cat => 
           foodItems.filter(item => 
             item.CategoryName === cat.CategoryName && 
             item.name.toLowerCase().includes(search.toLowerCase())
           ).length === 0
         ) && (
          <div className="text-center py-5">
            <i className="fas fa-search fa-4x text-muted mb-4"></i>
            <h3>No food items found</h3>
            <p className="text-muted">Try adjusting your search criteria</p>
            <button 
              className="btn btn-success"
              onClick={() => setSearch('')}
            >
              <i className="fas fa-undo me-2"></i>Clear Search
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

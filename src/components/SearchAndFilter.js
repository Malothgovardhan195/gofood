import React, { useState } from 'react';

export default function SearchAndFilter({ onSearch, onFilter, categories }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState('');
    const [sortBy, setSortBy] = useState('');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

    const handleFilter = () => {
        onFilter({
            category: selectedCategory,
            priceRange,
            sortBy,
            searchTerm
        });
    };

    return (
        <div className="container my-4">
            <div className="row g-3">
                {/* Search Bar */}
                <div className="col-12 col-md-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fas fa-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search for food..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                {/* Category Filter */}
                <div className="col-6 col-md-2">
                    <select 
                        className="form-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat.CategoryName}>
                                {cat.CategoryName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price Range */}
                <div className="col-6 col-md-2">
                    <select 
                        className="form-select"
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                    >
                        <option value="">Any Price</option>
                        <option value="0-100">₹0 - ₹100</option>
                        <option value="101-200">₹101 - ₹200</option>
                        <option value="201-300">₹201 - ₹300</option>
                        <option value="300+">₹300+</option>
                    </select>
                </div>

                {/* Sort By */}
                <div className="col-6 col-md-2">
                    <select 
                        className="form-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="">Sort By</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name">Name A-Z</option>
                    </select>
                </div>

                {/* Apply Filters Button */}
                <div className="col-6 col-md-2">
                    <button 
                        className="btn btn-success w-100"
                        onClick={handleFilter}
                    >
                        <i className="fas fa-filter me-1"></i>
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}

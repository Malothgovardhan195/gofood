import React, { useState } from 'react';

export default function Rating({ itemId, initialRating = 0, onRate }) {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);

    const handleRating = (ratingValue) => {
        setRating(ratingValue);
        if (onRate) {
            onRate(itemId, ratingValue);
        }
    };

    return (
        <div className="rating-component">
            <div className="stars">
                {[...Array(5)].map((star, index) => {
                    const ratingValue = index + 1;
                    return (
                        <button
                            type="button"
                            key={index}
                            className={`star ${ratingValue <= (hover || rating) ? 'active' : ''}`}
                            onClick={() => handleRating(ratingValue)}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(0)}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '20px',
                                cursor: 'pointer',
                                color: ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'
                            }}
                        >
                            <i className="fas fa-star"></i>
                        </button>
                    );
                })}
            </div>
            <span className="rating-text ms-2">
                {rating > 0 ? `${rating}/5` : 'Rate this item'}
            </span>
        </div>
    );
}

export function DisplayRating({ rating, reviewCount = 0 }) {
    return (
        <div className="display-rating d-flex align-items-center">
            <div className="stars">
                {[...Array(5)].map((star, index) => (
                    <i 
                        key={index}
                        className={`fas fa-star ${index < rating ? 'text-warning' : 'text-muted'}`}
                        style={{ fontSize: '14px' }}
                    ></i>
                ))}
            </div>
            <span className="ms-2 small text-muted">
                {rating.toFixed(1)} ({reviewCount} reviews)
            </span>
        </div>
    );
}

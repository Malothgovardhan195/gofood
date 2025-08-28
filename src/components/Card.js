import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatchCart, useCart } from './ContextReducer';

export default function Card(props) {
  let data = useCart();
  let navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const [rating, setRating] = useState(props.item.rating || 4);
  const [showSuccess, setShowSuccess] = useState(false);
  const priceRef = useRef();
  const dispatch = useDispatchCart();

  let options = props.options;
  let priceOptions = Object.keys(options);
  let foodItem = props.item;

  const handleClick = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  };

  const handleQty = (e) => {
    setQty(parseInt(e.target.value, 10));
  };

  const handleOptions = (e) => {
    setSize(e.target.value);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    // Here you could save the rating to backend
    console.log(`User rated ${props.foodName}: ${newRating} stars`);
  };

  useEffect(() => {
    setSize(priceRef.current.value);
  }, []);

  let finalPrice = size && options[size] ? qty * parseInt(options[size], 10) : 0;

  const handleAddToCart = async () => {
    let food = data.find((item) => item.id === foodItem._id) || null;

    if (food) {
      if (food.size === size) {
        await dispatch({ type: "UPDATE", id: foodItem._id, price: finalPrice, qty: qty });
      } else {
        await dispatch({ 
          type: "ADD", 
          id: foodItem._id, 
          name: foodItem.name, 
          price: finalPrice, 
          qty: qty, 
          size: size, 
          img: props.ImgSrc 
        });
        console.log("Size different, adding new item to cart.");
      }
    } else {
      await dispatch({ 
        type: "ADD", 
        id: foodItem._id, 
        name: foodItem.name, 
        price: finalPrice, 
        qty: qty, 
        size: size,
        img: props.ImgSrc
      });
    }

    // Show success animation
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1000);
  };

  return (
    <div>
      <div className="card mt-3 shadow-sm h-100 card-hover" style={{ width: "16rem", maxHeight: "460px" }}>
        <div className="position-relative">
          <img 
            src={props.ImgSrc} 
            className="card-img-top" 
            alt={props.foodName}
            style={{ height: "160px", objectFit: "cover" }} 
          />
          
          {/* Rating overlay */}
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-dark bg-opacity-75">
              <i className="fas fa-star text-warning me-1"></i>
              {rating.toFixed(1)}
            </span>
          </div>

          {/* Success overlay */}
          {showSuccess && (
            <div className="position-absolute top-50 start-50 translate-middle">
              <div className="bg-success text-white p-2 rounded-circle">
                <i className="fas fa-check fa-lg"></i>
              </div>
            </div>
          )}
        </div>
        
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-truncate fw-bold" title={props.foodName}>
            {props.foodName}
          </h5>
          
          {/* Simple Rating Display */}
          <div className="mb-2">
            <div className="d-flex align-items-center">
              {[...Array(5)].map((_, i) => (
                <i 
                  key={i} 
                  className={`fas fa-star ${i < rating ? 'text-warning' : 'text-muted'}`}
                  style={{ fontSize: '0.9em', marginRight: '2px' }}
                ></i>
              ))}
              <small className="text-muted ms-2">({Math.floor(Math.random() * 100) + 20} reviews)</small>
            </div>
          </div>
          
          <p className="card-text text-muted small flex-grow-1">
            {props.description || "Fresh and delicious vegetarian food prepared with love"}
          </p>

          <div className="container w-100 p-0" style={{ height: "38px" }}>
            <div className="row g-1">
              <div className="col-4">
                <select 
                  className="form-select form-select-sm bg-success text-white" 
                  onClick={handleClick} 
                  onChange={handleQty}
                  title="Quantity"
                >
                  {Array.from({ length: 6 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              
              <div className="col-4">
                <select 
                  className="form-select form-select-sm bg-success text-white" 
                  ref={priceRef} 
                  onClick={handleClick} 
                  onChange={handleOptions}
                  title="Size"
                >
                  {priceOptions.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
              
              <div className="col-4 d-flex align-items-center justify-content-center">
                <span className="badge bg-primary fs-6 fw-bold">
                  ₹{finalPrice}/-
                </span>
              </div>
            </div>
          </div>

          <hr className="my-2" />
          <button 
            className={`btn btn-sm w-100 ${showSuccess ? 'btn-success' : 'btn-outline-success'}`}
            onClick={handleAddToCart}
            disabled={!localStorage.getItem("token")}
          >
            {showSuccess ? (
              <>
                <i className="fas fa-check me-1"></i>
                Added!
              </>
            ) : (
              <>
                <i className="fas fa-cart-plus me-1"></i>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

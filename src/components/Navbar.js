/* eslint-disable react/jsx-no-undef */

import React, { useState, useContext } from 'react'
import { Link, useNavigate } from "react-router-dom";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from './ContextReducer';
import Modal from '../Modal';
import Cart from '../screens/Cart';
import { useTheme } from './ThemeContext';

export default function Navbar(props) {
    const [cartView, setCartView] = useState(false);
    const { isDarkTheme, toggleTheme } = useTheme();
    
    localStorage.setItem('temp', "first")
    let navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate("/login")
    }

    const loadCart = () => {
        setCartView(true)
    }

    const items = useCart();
    
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-success position-sticky"
                style={{ boxShadow: "0px 10px 20px black", filter: 'blur(20)', position: "fixed", zIndex: "10", width: "100%" }}>
                <div className="container-fluid">
                    <Link className="navbar-brand fs-1 fst-italic" to="/">
                        <i className="fas fa-utensils me-2"></i>GoFood
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link fs-5 mx-3 active" aria-current="page" to="/">
                                    <i className="fas fa-home me-1"></i>Home
                                </Link>
                            </li>
                            {(localStorage.getItem("token")) ?
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link fs-5 mx-3 active" aria-current="page" to="/myorder">
                                            <i className="fas fa-clipboard-list me-1"></i>My Orders
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link fs-5 mx-3 active" aria-current="page" to="/analytics">
                                            <i className="fas fa-chart-bar me-1"></i>Analytics
                                        </Link>
                                    </li>
                                </> : ""}
                        </ul>
                        
                        {/* Theme Toggle Button */}
                        <button 
                            className={`btn btn-sm mx-2 ${isDarkTheme ? 'btn-warning' : 'btn-outline-light'}`}
                            onClick={toggleTheme}
                            title={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`}
                        >
                            <i className={`fas fa-${isDarkTheme ? 'sun' : 'moon'}`}></i>
                        </button>

                        {(!localStorage.getItem("token")) ?
                            <form className="d-flex">
                                <Link className="btn bg-white text-success mx-1" to="/login">
                                    <i className="fas fa-sign-in-alt me-1"></i>Login
                                </Link>
                                <Link className="btn bg-white text-success mx-1" to="/signup">
                                    <i className="fas fa-user-plus me-1"></i>Signup
                                </Link>
                            </form> :
                            <div>
                                <div className="btn bg-white text-success mx-2" onClick={loadCart}>
                                    <Badge color="secondary" badgeContent={items.length}>
                                        <ShoppingCartIcon />
                                    </Badge>
                                    <span className="ms-1">Cart</span>
                                </div>

                                {cartView ? <Modal onClose={() => setCartView(false)}><Cart></Cart></Modal> : ""}

                                <button onClick={handleLogout} className="btn bg-white text-success">
                                    <i className="fas fa-sign-out-alt me-1"></i>Logout
                                </button>
                            </div>}
                    </div>
                </div>
            </nav>
        </div>
    )
}

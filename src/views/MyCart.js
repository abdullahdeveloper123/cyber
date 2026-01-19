import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { FiShoppingCart, FiMinus, FiPlus, FiX } from "react-icons/fi";

function MyCart() {
    const [cartItems, setCartItems] = useState([]);
    const [promoCode, setPromoCode] = useState("");
    const [bonusCard, setBonusCard] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(savedCart);
        
        // Redirect to login if not authenticated
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        const updatedCart = cartItems.map(item => 
            item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const removeFromCart = (productId) => {
        const updatedCart = cartItems.filter(item => item.id !== productId);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const calculateTax = () => {
        return calculateSubtotal() * 0.08; // 8% tax
    };

    const calculateShipping = () => {
        return calculateSubtotal() > 50 ? 0 : 25; // Free shipping over $50
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax() + calculateShipping();
    };

    const handleCheckout = () => {
        // Navigate to checkout page
        navigate("/checkout");
    };

    if (!user) {
        return (
            <>
                <Navbar />
                <div className="cart-page">
                    <div className="cart-container">
                        <div className="empty-cart">
                            <FiShoppingCart className="empty-icon" />
                            <h2>Please login to view your cart</h2>
                            <p>Sign in to add items to your cart and checkout</p>
                            <button 
                                className="continue-shopping-btn"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="cart-page">
                <div className="cart-container">
                    <h1 className="cart-title">Shopping Cart</h1>
                    
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <FiShoppingCart className="empty-icon" />
                            <h2>Your cart is empty</h2>
                            <p>Add some items to your cart to get started</p>
                            <button 
                                className="continue-shopping-btn"
                                onClick={() => navigate("/")}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="cart-content">
                            {/* Cart Items */}
                            <div className="cart-items-section">
                                {cartItems.map((item) => (
                                    <div key={`${item.id}-${item.color}-${item.storage}`} className="cart-item">
                                        <div className="cart-item-image">
                                            <img src={item.image} alt={item.title} />
                                        </div>
                                        
                                        <div className="cart-item-details">
                                            <h3 className="cart-item-title">{item.title}</h3>
                                            <p className="cart-item-price">${item.price}</p>
                                            {item.color && <p className="cart-item-variant">Color: {item.color}</p>}
                                            {item.storage && <p className="cart-item-variant">Storage: {item.storage}</p>}
                                        </div>

                                        <div className="cart-item-quantity">
                                            <button 
                                                className="quantity-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                <FiMinus />
                                            </button>
                                            <span className="quantity-display">{item.quantity}</span>
                                            <button 
                                                className="quantity-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <FiPlus />
                                            </button>
                                        </div>

                                        <div className="cart-item-total">
                                            <span className="item-total-price">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>

                                        <button 
                                            className="remove-item-btn"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            <FiX />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="order-summary-section">
                                <div className="order-summary">
                                    <h2>Order Summary</h2>
                                    
                                    {/* Promo Code */}
                                    <div className="promo-section">
                                        <label>Discount code / Promo code</label>
                                        <div className="promo-input-group">
                                            <input
                                                type="text"
                                                placeholder="Code"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                            />
                                            <button className="apply-btn">Apply</button>
                                        </div>
                                    </div>

                                    {/* Bonus Card */}
                                    <div className="bonus-section">
                                        <label>Your bonus card number</label>
                                        <div className="bonus-input-group">
                                            <input
                                                type="text"
                                                placeholder="Enter Card Number"
                                                value={bonusCard}
                                                onChange={(e) => setBonusCard(e.target.value)}
                                            />
                                            <button className="apply-btn">Apply</button>
                                        </div>
                                    </div>

                                    {/* Price Breakdown */}
                                    <div className="price-breakdown">
                                        <div className="price-row">
                                            <span>Subtotal</span>
                                            <span>${calculateSubtotal().toFixed(2)}</span>
                                        </div>
                                        <div className="price-row">
                                            <span>Estimated Tax</span>
                                            <span>${calculateTax().toFixed(2)}</span>
                                        </div>
                                        <div className="price-row">
                                            <span>Estimated shipping & Handling</span>
                                            <span>${calculateShipping().toFixed(2)}</span>
                                        </div>
                                        <div className="price-row total-row">
                                            <span>Total</span>
                                            <span>${calculateTotal().toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <button className="checkout-btn" onClick={handleCheckout}>
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default MyCart;
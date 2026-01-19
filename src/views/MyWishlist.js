import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { FiHeart, FiShoppingCart } from "react-icons/fi";

function MyWishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Load wishlist from localStorage
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWishlistItems(savedWishlist);
        
        // Redirect to login if not authenticated
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const removeFromWishlist = (productId) => {
        const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
        setWishlistItems(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        
        // Dispatch custom event to update navbar
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    };

    const moveToCart = (item) => {
        // Add to cart
        const cartItem = {
            id: item.id,
            title: item.title,
            price: item.price,
            image: item.image,
            color: "Black", // Default color
            storage: "1TB", // Default storage
            quantity: 1
        };

        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingItemIndex = existingCart.findIndex(existingItem => existingItem.id === item.id);

        if (existingItemIndex > -1) {
            existingCart[existingItemIndex].quantity += 1;
        } else {
            existingCart.push(cartItem);
        }

        localStorage.setItem("cart", JSON.stringify(existingCart));

        // Dispatch custom events to update navbar
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));

        // Remove from wishlist
        removeFromWishlist(item.id);
    };

    if (!user) {
        return (
            <>
                <Navbar />
                <div className="wishlist-page">
                    <div className="wishlist-container">
                        <div className="empty-wishlist">
                            <FiHeart className="empty-icon" />
                            <h2>Please login to view your wishlist</h2>
                            <p>Sign in to save items you love and shop them later</p>
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
            <div className="wishlist-page">
                <div className="wishlist-container">
                    <div className="wishlist-header">
                        <div className="wishlist-title-section">
                            <FiHeart className="wishlist-icon" />
                            <h1>My Wishlist</h1>
                            <span className="wishlist-count">({wishlistItems.length} items)</span>
                        </div>
                        
                        {wishlistItems.length > 0 && (
                            <button 
                                className="clear-wishlist-btn"
                                onClick={() => {
                                    setWishlistItems([]);
                                    localStorage.removeItem("wishlist");
                                    // Dispatch custom event to update navbar
                                    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
                                }}
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    {wishlistItems.length === 0 ? (
                        <div className="empty-wishlist">
                            <FiHeart className="empty-icon" />
                            <h2>Your wishlist is empty</h2>
                            <p>Save items you love to your wishlist and shop them later</p>
                            <button 
                                className="continue-shopping-btn"
                                onClick={() => navigate("/")}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="wishlist-grid">
                            {wishlistItems.map((item) => (
                                <div key={item.id} className="wishlist-item-wrapper">
                                    <ProductCard
                                        image={item.image}
                                        name={item.title}
                                        id={item.id}
                                        price={item.price}
                                    />
                                    <div className="wishlist-item-actions">
                                        <button 
                                            className="move-to-cart-btn"
                                            onClick={() => moveToCart(item)}
                                        >
                                            <FiShoppingCart />
                                            Move to Cart
                                        </button>
                                        <button 
                                            className="remove-from-wishlist-btn"
                                            onClick={() => removeFromWishlist(item.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default MyWishlist;
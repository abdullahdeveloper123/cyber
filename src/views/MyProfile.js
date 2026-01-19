import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { FiUser, FiShoppingBag, FiHeart, FiSettings, FiLogOut, FiMail, FiUser as FiUserIcon, FiHeart as FiHeartIcon, FiShoppingCart } from 'react-icons/fi';

function MyProfile() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [userStats, setUserStats] = useState({
        totalOrders: 0,
        wishlistItems: 0,
        displayName: ''
    });
    const [orders, setOrders] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Load user stats from localStorage or API
        loadUserStats();
        loadOrders();
        loadWishlist();
    }, [user, navigate]);

    const loadUserStats = () => {
        // Get orders from localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const userOrders = orders.filter(order => order.userId === user?.uid);

        // Get wishlist from localStorage
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

        // Get display name from user profile or localStorage
        const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        
        setUserStats({
            totalOrders: userOrders.length,
            wishlistItems: wishlist.length,
            displayName: savedProfile.displayName || user?.displayName || ''
        });
    };

    const loadOrders = () => {
        // Get real orders from localStorage
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        // Filter orders for current user
        const userOrders = savedOrders.filter(order => order.userId === user?.uid);
        
        // Transform cart data to order format if needed
        const transformedOrders = userOrders.map(order => {
            // If order doesn't have proper structure, transform it
            if (!order.id || !order.date) {
                return {
                    id: order.id || `ORD-${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
                    userId: order.userId || user?.uid,
                    date: order.date || new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    }),
                    status: order.status || 'Processing',
                    items: order.items || order.products || [],
                    shipping: order.shipping || {
                        method: 'Standard Delivery',
                        address: '2118 Thornridge Cir Syracuse, Connecticut 35624'
                    },
                    total: order.total || (order.items || order.products || []).reduce((sum, item) => 
                        sum + (item.price * (item.quantity || 1)), 0
                    )
                };
            }
            return order;
        });
        
        setOrders(transformedOrders);
    };

    // Function to create order from cart (can be called from checkout)
    const createOrderFromCart = () => {
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        
        if (cartItems.length === 0) return;

        const newOrder = {
            id: `ORD-${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            userId: user?.uid,
            date: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            status: 'Processing',
            items: cartItems,
            shipping: {
                method: 'Standard Delivery',
                address: '2118 Thornridge Cir Syracuse, Connecticut 35624'
            },
            total: cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
        };

        // Save order to localStorage
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        existingOrders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(existingOrders));

        // Clear cart after creating order
        localStorage.setItem('cart', JSON.stringify([]));

        // Reload orders and stats
        loadOrders();
        loadUserStats();

        return newOrder;
    };

    const loadWishlist = () => {
        // Load wishlist from localStorage
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWishlistItems(savedWishlist);
    };

    const removeFromWishlist = (productId) => {
        const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
        setWishlistItems(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        
        // Dispatch custom event to update navbar
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
        
        // Update stats
        loadUserStats();
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

        // Dispatch custom event to update navbar
        window.dispatchEvent(new CustomEvent('cartUpdated'));

        // Remove from wishlist
        removeFromWishlist(item.id);
    };

    const clearWishlist = () => {
        setWishlistItems([]);
        localStorage.removeItem("wishlist");
        
        // Dispatch custom event to update navbar
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
        
        loadUserStats();
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const getInitials = (email) => {
        if (!email) return 'U';
        return email.charAt(0).toUpperCase();
    };

    const menuItems = [
        {
            id: 'overview',
            label: 'Overview',
            icon: FiUser,
            active: true
        },
        {
            id: 'orders',
            label: 'Orders',
            icon: FiShoppingBag,
            active: false
        },
        {
            id: 'wishlist',
            label: 'Wishlist',
            icon: FiHeart,
            active: false
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: FiSettings,
            active: false
        }
    ];

    if (!user) {
        return null;
    }

    return (
        <>
            <Navbar />
            <div className="profile-page">
                <div className="profile-container">
                    {/* Profile Header */}
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {getInitials(user.email)}
                        </div>
                        <div className="profile-info">
                            <h1 className="profile-title">User Profile</h1>
                            <p className="profile-email">{user.email}</p>
                        </div>
                    </div>

                    <div className="profile-layout">
                        {/* Sidebar */}
                        <div className="profile-sidebar">
                            {menuItems.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
                                        onClick={() => setActiveTab(item.id)}
                                    >
                                        <IconComponent className="sidebar-icon" />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                            
                            <button className="sidebar-item logout-item" onClick={handleLogout}>
                                <FiLogOut className="sidebar-icon" />
                                <span>Logout</span>
                            </button>
                        </div>

                        {/* Main Content */}
                        <div className="profile-content">
                            {activeTab === 'overview' && (
                                <div className="overview-section">
                                    <h2 className="section-title">Account Overview</h2>
                                    
                                    <div className="overview-grid">
                                        <div className="overview-card">
                                            <div className="card-icon">
                                                <FiMail />
                                            </div>
                                            <div className="card-content">
                                                <h3 className="card-title">Email</h3>
                                                <p className="card-value">{user.email}</p>
                                            </div>
                                        </div>

                                        <div className="overview-card">
                                            <div className="card-icon">
                                                <FiUserIcon />
                                            </div>
                                            <div className="card-content">
                                                <h3 className="card-title">Display Name</h3>
                                                <p className="card-value">{userStats.displayName || 'Not set'}</p>
                                            </div>
                                        </div>

                                        <div className="overview-card">
                                            <div className="card-icon">
                                                <FiShoppingCart />
                                            </div>
                                            <div className="card-content">
                                                <h3 className="card-title">Total Orders</h3>
                                                <p className="card-value">{userStats.totalOrders}</p>
                                            </div>
                                        </div>

                                        <div className="overview-card">
                                            <div className="card-icon">
                                                <FiHeartIcon />
                                            </div>
                                            <div className="card-content">
                                                <h3 className="card-title">Wishlist Items</h3>
                                                <p className="card-value">{userStats.wishlistItems}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="account-status">
                                        <h3 className="status-title">Account Status</h3>
                                        <p className="status-message">Your account is active and verified.</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div className="orders-section">
                                    <h2 className="section-title">Order History</h2>
                                    
                                    {orders.length === 0 ? (
                                        <div className="empty-orders">
                                            <p>No orders found. Complete a purchase to see your orders here.</p>
                                        </div>
                                    ) : (
                                        <div className="orders-list">
                                            {orders.map((order) => (
                                                <div key={order.id} className="order-card">
                                                    <div className="order-header">
                                                        <div className="order-info">
                                                            <h3 className="order-id">Order #{order.id}</h3>
                                                            <p className="order-date">{order.date}</p>
                                                        </div>
                                                        <div className="order-status">
                                                            <span className={`status-badge ${order.status.toLowerCase()}`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="order-items">
                                                        {(order.items || order.products || []).map((item, index) => (
                                                            <div key={item.id || index} className="order-item">
                                                                <div className="item-image">
                                                                    <img 
                                                                        src={item.image || 'https://via.placeholder.com/60x60?text=Product'} 
                                                                        alt={item.title || item.name || 'Product'} 
                                                                    />
                                                                </div>
                                                                <div className="item-details">
                                                                    <h4 className="item-name">
                                                                        {item.title || item.name || 'Product'}
                                                                    </h4>
                                                                    <p className="item-quantity">
                                                                        Qty: {item.quantity || 1}
                                                                    </p>
                                                                </div>
                                                                <div className="item-price">
                                                                    ${(item.price || 0).toFixed(2)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="order-footer">
                                                        <div className="shipping-info">
                                                            <p className="shipping-method">
                                                                {order.shipping?.method || 'Standard Delivery'}
                                                            </p>
                                                            <p className="shipping-address">
                                                                {order.shipping?.address || 'Address not specified'}
                                                            </p>
                                                        </div>
                                                        <div className="order-total">
                                                            <span className="total-label">Total</span>
                                                            <span className="total-amount">
                                                                ${(order.total || 0).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'wishlist' && (
                                <div className="wishlist-section">
                                    <div className="wishlist-header-profile">
                                        <h2 className="section-title">My Wishlist</h2>
                                        {wishlistItems.length > 0 && (
                                            <button 
                                                className="clear-wishlist-btn-profile"
                                                onClick={clearWishlist}
                                            >
                                                Clear All
                                            </button>
                                        )}
                                    </div>

                                    {wishlistItems.length === 0 ? (
                                        <div className="empty-wishlist-profile">
                                            <FiHeart className="empty-icon-profile" />
                                            <h3>Your wishlist is empty</h3>
                                            <p>Save items you love to your wishlist and shop them later</p>
                                            <button 
                                                className="continue-shopping-btn-profile"
                                                onClick={() => navigate("/")}
                                            >
                                                Continue Shopping
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="wishlist-grid-profile">
                                            {wishlistItems.map((item) => (
                                                <div key={item.id} className="wishlist-item-wrapper-profile">
                                                    <ProductCard
                                                        image={item.image}
                                                        name={item.title}
                                                        id={item.id}
                                                        price={item.price}
                                                    />
                                                    <div className="wishlist-item-actions-profile">
                                                        <button 
                                                            className="move-to-cart-btn-profile"
                                                            onClick={() => moveToCart(item)}
                                                        >
                                                            <FiShoppingCart />
                                                            Move to Cart
                                                        </button>
                                                        <button 
                                                            className="remove-from-wishlist-btn-profile"
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
                            )}

                            {activeTab === 'settings' && (
                                <div className="settings-section">
                                    <h2 className="section-title">Settings</h2>
                                    <p>Settings functionality coming soon...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MyProfile;
import React, { useState, useEffect, useCallback } from 'react';
import { BsHeart, BsCart, BsPerson, BsSearch } from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import Logo from '../assets/Logo.png';

function Navbar() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    // Shared count updater
    const updateCounts = useCallback(() => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const totalCartItems = cart.reduce(
            (sum, item) => sum + (item.quantity || 1),
            0
        );
        setCartCount(totalCartItems);

        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWishlistCount(wishlist.length);
    }, []);

    // Initial load + event listeners
    useEffect(() => {
        updateCounts();

        const handleStorageChange = (e) => {
            if (e.key === 'cart' || e.key === 'wishlist') {
                updateCounts();
            }
        };

        const handleCartUpdate = () => updateCounts();

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('cartUpdated', handleCartUpdate);
        window.addEventListener('wishlistUpdated', handleCartUpdate);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('cartUpdated', handleCartUpdate);
            window.removeEventListener('wishlistUpdated', handleCartUpdate);
        };
    }, [updateCounts]);

    // Update counts on login / logout
    useEffect(() => {
        updateCounts();
    }, [user, updateCounts]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
            setIsDropdownOpen(false);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const toggleDropdown = () => setIsDropdownOpen(prev => !prev);
    const closeDropdown = () => setIsDropdownOpen(false);

    return (
        <nav className="navbar navbar-expand-lg navbar-custom">
            <div className="container">
                <Link className="navbar-brand brand-logo" to="/">
                    <img src={Logo} alt="Logo" />
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Search (desktop only) */}
                <div className="d-none d-lg-flex search-container">
                    <BsSearch className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search"
                    />
                </div>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {/* Center Links */}
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0 py-3">
                        <li className="nav-item">
                            <Link className="nav-link nav-link-custom active" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link nav-link-custom" href="#">About</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link nav-link-custom" href="#">Contact Us</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link nav-link-custom" href="#">Blog</a>
                        </li>
                    </ul>

                    {/* Right Icons */}
                    <ul className="navbar-nav mb-2 mb-lg-0 nav-icons">
                        <li className="nav-item">
                            <Link
                                className="nav-link nav-icon-with-badge"
                                to="/wishlist"
                                title="Wishlist"
                            >
                                <BsHeart />
                                {wishlistCount > 0 && (
                                    <span className="nav-badge">{wishlistCount}</span>
                                )}
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link nav-icon-with-badge"
                                to="/cart"
                                title="Cart"
                            >
                                <BsCart />
                                {cartCount > 0 && (
                                    <span className="nav-badge">{cartCount}</span>
                                )}
                            </Link>
                        </li>

                        <li className="nav-item">
                            {user ? (
                                <div className="nav-user-dropdown">
                                    <button
                                        className="nav-link user-btn"
                                        onClick={toggleDropdown}
                                        title="Account"
                                    >
                                        <BsPerson />
                                    </button>

                                    {isDropdownOpen && (
                                        <>
                                            <div
                                                className="dropdown-overlay"
                                                onClick={closeDropdown}
                                            ></div>

                                            <div className="user-dropdown-menu p-3">
                                                <div className="dropdown-header py-2">
                                                    <span className="signed-in-text">
                                                        Signed in as
                                                    </span>
                                                    <span className="user-email">
                                                        {user.email}
                                                    </span>
                                                </div>

                                                <Link
                                                    to="/profile"
                                                    className="dropdown-item py-2"
                                                    onClick={closeDropdown}
                                                >
                                                    My Profile
                                                </Link>

                                                <button
                                                    className="dropdown-item"
                                                    onClick={closeDropdown}
                                                >
                                                    Switch Account
                                                </button>

                                                <button
                                                    className="dropdown-item logout-item py-2 text-danger"
                                                    onClick={handleLogout}
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    className="nav-link"
                                    to="/login"
                                    title="Login"
                                >
                                    <BsPerson />
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiTruck, FiShoppingBag, FiAward, FiChevronDown, FiHeart } from "react-icons/fi";
import { BsCpu, BsCamera, BsBatteryCharging } from "react-icons/bs";

function ProductInfo({ product }) {
    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedStorage, setSelectedStorage] = useState("1TB");
    const [mainImage, setMainImage] = useState(product.image);
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [addedToWishlist, setAddedToWishlist] = useState(false);
    const [isInCart, setIsInCart] = useState(false);
    const [cartQuantity, setCartQuantity] = useState(0);
    
    const { user } = useAuth();
    const navigate = useNavigate();

    // Mock data for colors (since API doesn't provide this)
    const colors = [
        { name: "Black", hex: "#000000" },
        { name: "Purple", hex: "#800080" },
        { name: "Red", hex: "#FF0000" },
        { name: "Gold", hex: "#FFD700" },
        { name: "Silver", hex: "#C0C0C0" }
    ];

    // Mock storage options
    const storageOptions = ["128GB", "256GB", "512GB", "1TB"];

    // Mock specs
    const specs = [
        { icon: <BsCpu />, label: "Screen size", value: "6.7\"" },
        { icon: <BsCpu />, label: "CPU", value: "Apple A16 Bionic" },
        { icon: <BsCpu />, label: "Number of Cores", value: "6" },
        { icon: <BsCamera />, label: "Main camera", value: "48-12 MP" },
        { icon: <BsCamera />, label: "Front-camera", value: "12 MP" },
        { icon: <BsBatteryCharging />, label: "Battery capacity", value: "4323 mAh" }
    ];

    // Mock delivery info
    const deliveryInfo = [
        { icon: <FiTruck />, title: "Free Delivery", subtitle: "1-2 day" },
        { icon: <FiShoppingBag />, title: "In Stock", subtitle: "Today" },
        { icon: <FiAward />, title: "Guaranteed", subtitle: "1 year" }
    ];

    // Thumbnail images (using main image as fallback)
    const thumbnails = [product.image, product.image, product.image, product.image];

    // Detailed specifications
    const detailsIntro = "Just as a book is judged by its cover, the first thing you notice when you pick up a modern smartphone is the display. Nothing surprising, because advanced technologies allow you to practically level the display frames and cutouts for the front camera and speaker, leaving no room for bold design solutions. And how good that in such realities Apple everything is fine with displays. Both critics and mass consumers always praise the quality of the picture provided by the products of the Californian brand. And last year's 6.7-inch Retina panels, which had ProMotion, caused real admiration for many.";

    const screenDetails = [
        { label: "Screen diagonal", value: "6.7\"" },
        { label: "The screen resolution", value: "2796x1290" },
        { label: "The screen refresh rate", value: "120 Hz" },
        { label: "The pixel density", value: "460 ppi" },
        { label: "Screen type", value: "OLED" },
        { 
            label: "Additionally", 
            value: ["Dynamic Island", "Always-On display", "HDR display", "True Tone", "Wide color (P3)"]
        }
    ];

    const cpuDetails = [
        { label: "CPU", value: "A16 Bionic" },
        { label: "Number of cores", value: "6" },
        { label: "CPU type", value: "64-bit" },
        { label: "Processor frequency", value: "3.46 GHz" }
    ];

    const cameraDetails = [
        { label: "Main camera", value: "48 MP + 12 MP + 12 MP" },
        { label: "Front camera", value: "12 MP" },
        { label: "Video recording", value: "4K at 60 fps" },
        { label: "Flash", value: "Dual LED" }
    ];

    const batteryDetails = [
        { label: "Battery capacity", value: "4323 mAh" },
        { label: "Battery type", value: "Li-Ion" },
        { label: "Fast charging", value: "20W" },
        { label: "Wireless charging", value: "15W MagSafe" }
    ];

    const handleAddToCart = async () => {
        if (!user) {
            // Redirect to login if not authenticated
            navigate("/login", { state: { from: `/product/${product.id}` } });
            return;
        }

        try {
            // Prepare cart item for localStorage
            const cartItem = {
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                color: colors[selectedColor].name,
                storage: selectedStorage,
                quantity: 1
            };

            // Get existing cart from localStorage
            const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
            
            // Check if item already exists
            const existingItemIndex = existingCart.findIndex(
                item => item.id === cartItem.id && 
                        item.color === cartItem.color && 
                        item.storage === cartItem.storage
            );

            if (existingItemIndex > -1) {
                // Update quantity if item exists
                existingCart[existingItemIndex].quantity += 1;
            } else {
                // Add new item
                existingCart.push(cartItem);
            }

            // Save to localStorage
            localStorage.setItem("cart", JSON.stringify(existingCart));

            // Dispatch custom event to update navbar
            window.dispatchEvent(new CustomEvent('cartUpdated'));

            // Prepare data for API call
            const apiData = {
                id: 0,
                userId: parseInt(user.uid) || 0,
                products: [
                    {
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        description: product.description,
                        category: product.category,
                        image: product.image
                    }
                ]
            };

            // Call API to save cart on server
            const response = await fetch(`${process.env.REACT_APP_FAKE_STORE_API_URL}/carts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(apiData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Cart saved to server:", data);
            }

            // Show success feedback and update cart state
            setAddedToCart(true);
            setIsInCart(true);
            
            // Recalculate cart quantity
            const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]");
            const updatedCartItems = updatedCart.filter(item => item.id === product.id);
            const updatedQuantity = updatedCartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
            setCartQuantity(updatedQuantity);
            
            setTimeout(() => setAddedToCart(false), 3000);

        } catch (error) {
            console.error("Error adding to cart:", error);
            // Still show success for localStorage even if API fails
            setAddedToCart(true);
            setIsInCart(true);
            
            // Recalculate cart quantity
            const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]");
            const updatedCartItems = updatedCart.filter(item => item.id === product.id);
            const updatedQuantity = updatedCartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
            setCartQuantity(updatedQuantity);
            
            setTimeout(() => setAddedToCart(false), 3000);
        }
    };

    const handleAddToWishlist = async () => {
        if (!user) {
            // Redirect to login if not authenticated
            navigate("/login", { state: { from: `/product/${product.id}` } });
            return;
        }

        try {
            // Add to wishlist only
            const wishlistItem = {
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                category: product.category,
                description: product.description
            };

            const existingWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
            const wishlistItemIndex = existingWishlist.findIndex(item => item.id === wishlistItem.id);

            if (wishlistItemIndex === -1) {
                // Add to wishlist if not already there
                existingWishlist.push(wishlistItem);
                localStorage.setItem("wishlist", JSON.stringify(existingWishlist));
                
                // Dispatch custom event to update navbar
                window.dispatchEvent(new CustomEvent('wishlistUpdated'));
                
                // Show success feedback
                setAddedToWishlist(true);
                setTimeout(() => setAddedToWishlist(false), 3000);
            } else {
                // Item already in wishlist
                console.log("Item already in wishlist");
            }

        } catch (error) {
            console.error("Error adding to wishlist:", error);
        }
    };

    // Check if item is in wishlist and cart on component mount
    useEffect(() => {
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        const isInWishlist = wishlist.some(item => item.id === product.id);
        setAddedToWishlist(isInWishlist);

        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const cartItems = cart.filter(item => item.id === product.id);
        const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        setIsInCart(totalQuantity > 0);
        setCartQuantity(totalQuantity);
    }, [product.id]);

    return (
        <div className="product-detail-container">
            <div className="product-detail-wrapper">
                {/* Left Side - Images */}
                <div className="product-images-section">
                    <div className="product-thumbnails">
                        {thumbnails.map((img, index) => (
                            <div
                                key={index}
                                className={`thumbnail ${mainImage === img ? "active" : ""}`}
                                onClick={() => setMainImage(img)}
                            >
                                <img src={img} alt={`Thumbnail ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                    <div className="product-main-image">
                        <img src={mainImage} alt={product.title} />
                    </div>
                </div>

                {/* Right Side - Product Info */}
                <div className="product-info-section">
                    <h1 className="product-detail-title">{product.title}</h1>
                    
                    <div className="product-pricing">
                        <span className="current-price">${product.price}</span>
                        <span className="original-price">${(product.price * 1.2).toFixed(0)}</span>
                    </div>

                    {/* Color Selection */}
                    <div className="product-options">
                        <label className="option-label">Select color:</label>
                        <div className="color-options">
                            {colors.map((color, index) => (
                                <button
                                    key={index}
                                    className={`color-btn ${selectedColor === index ? "active" : ""}`}
                                    style={{ backgroundColor: color.hex }}
                                    onClick={() => setSelectedColor(index)}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Storage Selection */}
                    <div className="product-options">
                        <div className="storage-options">
                            {storageOptions.map((storage) => (
                                <button
                                    key={storage}
                                    className={`storage-btn ${selectedStorage === storage ? "active" : ""}`}
                                    onClick={() => setSelectedStorage(storage)}
                                >
                                    {storage}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Specifications Grid */}
                    <div className="product-specs-grid">
                        {specs.map((spec, index) => (
                            <div key={index} className="spec-item">
                                <div className="spec-icon">{spec.icon}</div>
                                <div className="spec-details">
                                    <span className="spec-label">{spec.label}</span>
                                    <span className="spec-value">{spec.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    <div className="product-description">
                        <p>{product.description}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="product-actions">
                        <button 
                            className={`btn-add-wishlist ${addedToWishlist ? "added" : ""}`}
                            onClick={handleAddToWishlist}
                            disabled={addedToWishlist}
                        >
                            <FiHeart className={addedToWishlist ? "filled" : ""} />
                            {addedToWishlist ? "In Wishlist" : user ? "Add to Wishlist" : "Login to Add"}
                        </button>
                        <button 
                            className={`btn-add-cart ${addedToCart ? "added" : ""} ${isInCart ? "in-cart" : ""}`}
                            onClick={handleAddToCart}
                        >
                            {addedToCart ? "Added to Cart!" : 
                             isInCart ? `In Cart (${cartQuantity})` : 
                             user ? "Add to Cart" : "Login to Add"}
                        </button>
                    </div>

                    {!user && (
                        <div className="auth-notice">
                            <p>Please <span onClick={() => navigate("/login")}>login</span> to add items to cart or wishlist</p>
                        </div>
                    )}

                    {/* Delivery Info */}
                    <div className="delivery-info-grid">
                        {deliveryInfo.map((info, index) => (
                            <div key={index} className="delivery-item">
                                <div className="delivery-icon">{info.icon}</div>
                                <div className="delivery-details">
                                    <span className="delivery-title">{info.title}</span>
                                    <span className="delivery-subtitle">{info.subtitle}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="product-details-section">
                <h2 className="details-section-title">Details</h2>
                
                <p className="details-intro">{detailsIntro}</p>

                {/* Screen Section */}
                <div className="details-category">
                    <h3 className="details-category-title">Screen</h3>
                    <div className="details-list">
                        {screenDetails.map((detail, index) => (
                            <div key={index} className="detail-row">
                                <span className="detail-label">{detail.label}</span>
                                <span className="detail-value">
                                    {Array.isArray(detail.value) 
                                        ? detail.value.map((item, i) => (
                                            <span key={i} className="detail-value-item">{item}</span>
                                          ))
                                        : detail.value
                                    }
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CPU Section */}
                <div className="details-category">
                    <h3 className="details-category-title">CPU</h3>
                    <div className="details-list">
                        {cpuDetails.slice(0, showMoreDetails ? cpuDetails.length : 2).map((detail, index) => (
                            <div key={index} className="detail-row">
                                <span className="detail-label">{detail.label}</span>
                                <span className="detail-value">{detail.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Show More Details */}
                {showMoreDetails && (
                    <>
                        {/* Camera Section */}
                        <div className="details-category">
                            <h3 className="details-category-title">Camera</h3>
                            <div className="details-list">
                                {cameraDetails.map((detail, index) => (
                                    <div key={index} className="detail-row">
                                        <span className="detail-label">{detail.label}</span>
                                        <span className="detail-value">{detail.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Battery Section */}
                        <div className="details-category">
                            <h3 className="details-category-title">Battery</h3>
                            <div className="details-list">
                                {batteryDetails.map((detail, index) => (
                                    <div key={index} className="detail-row">
                                        <span className="detail-label">{detail.label}</span>
                                        <span className="detail-value">{detail.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* View More Button */}
                <button 
                    className="view-more-btn"
                    onClick={() => setShowMoreDetails(!showMoreDetails)}
                >
                    {showMoreDetails ? "View Less" : "View More"}
                    <FiChevronDown 
                        style={{ 
                            transform: showMoreDetails ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.3s"
                        }} 
                    />
                </button>
            </div>
        </div>
    );
}

export default ProductInfo;
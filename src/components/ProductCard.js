import React, { useState, useEffect } from 'react'
import { BiHeart } from 'react-icons/bi'
import { FiHeart } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProductCard(prop) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Check if item is in wishlist on component mount
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const inWishlist = wishlist.some(item => item.id === prop.id);
    setIsInWishlist(inWishlist);
  }, [prop.id]);

  const handleClick = () => {
    navigate(`/product/${prop.id}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking heart
    
    if (!user) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }

    const wishlistItem = {
      id: prop.id,
      title: prop.name,
      price: prop.price,
      image: prop.image,
      category: prop.category || 'general',
      description: prop.description || prop.name
    };

    const existingWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const wishlistItemIndex = existingWishlist.findIndex(item => item.id === prop.id);

    if (wishlistItemIndex === -1) {
      // Add to wishlist
      existingWishlist.push(wishlistItem);
      localStorage.setItem("wishlist", JSON.stringify(existingWishlist));
      setIsInWishlist(true);
      
      // Dispatch custom event to update navbar
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    } else {
      // Remove from wishlist
      existingWishlist.splice(wishlistItemIndex, 1);
      localStorage.setItem("wishlist", JSON.stringify(existingWishlist));
      setIsInWishlist(false);
      
      // Dispatch custom event to update navbar
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    }
  };

  return (
    <div className='ProductsCard'>
      <div 
        className={`wishlist-heart ${isInWishlist ? 'active' : ''}`}
        onClick={handleWishlistClick}
        title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {isInWishlist ? <FiHeart className="filled-heart" /> : <BiHeart />}
      </div>
      <div className="img-wrapper" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <img src={prop.image} alt={prop.name} />
      </div>
      <div className="text-wrapper">
        <p className="product_name" onClick={handleClick} style={{ cursor: 'pointer' }}>
          {prop.name}
        </p>
        <p className='product_price'>${prop.price}</p>
        <button onClick={handleClick} style={{ cursor: 'pointer', border: 'none' }}>
          Buy Now
        </button>
      </div>
    </div>
  )
}

export default ProductCard
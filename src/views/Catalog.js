import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FiHeart, FiSliders } from "react-icons/fi";

function Catalog() {
    const { category } = useParams();
    const decodedCategory = decodeURIComponent(category);

    const [products, setProducts] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [sortBy, setSortBy] = useState("newest");
    const [showFilters, setShowFilters] = useState(false);

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });

    const GAP = 5;

    /* ---------------- FETCH PRODUCTS ---------------- */
    useEffect(() => {
        async function getProducts() {
            const res = await fetch("https://fakestoreapi.com/products");
            const data = await res.json();
            setProducts(data);
        }
        getProducts();
    }, []);

    /* ---------------- FILTER BY CATEGORY ---------------- */
    useEffect(() => {
        const filtered = products.filter(
            (product) => product.category === decodedCategory
        );

        setCategoryProducts(filtered);
        setFilteredProducts(filtered);
    }, [products, decodedCategory]);

    /* ---------------- SET PRICE RANGE ---------------- */
    useEffect(() => {
        if (categoryProducts.length) {
            const prices = categoryProducts.map((p) => p.price);
            const min = Math.min(...prices);
            const max = Math.max(...prices);

            setPriceRange({ min, max });
            setMinPrice(min);
            setMaxPrice(max);
        }
    }, [categoryProducts]);

    /* ---------------- APPLY PRICE FILTER ---------------- */
    const applyFilter = () => {
        const priceFiltered = categoryProducts.filter(
            (product) =>
                product.price >= minPrice && product.price <= maxPrice
        );

        setFilteredProducts(priceFiltered);
    };

    /* ---------------- SORT PRODUCTS ---------------- */
    useEffect(() => {
        let sorted = [...filteredProducts];

        if (sortBy === "rating") {
            sorted.sort((a, b) => b.rating.rate - a.rating.rate);
        }

        if (sortBy === "priceDesc") {
            sorted.sort((a, b) => b.price - a.price);
        }

        if (sortBy === "priceAsc") {
            sorted.sort((a, b) => a.price - b.price);
        }

        if (sortBy === "newest") {
            sorted.sort((a, b) => b.id - a.id);
        }

        setFilteredProducts(sorted);
    }, [sortBy]);

    return (
        <>
            <Navbar />

            <div className="catalog-container">
                {/* Breadcrumb */}
                <div className="breadcrumb-nav">
                    <Link to="/">Home</Link>
                    <span>&gt;</span>
                    <Link to="/catalog">Catalog</Link>
                    <span>&gt;</span>
                    <span className="breadcrumb-active">{decodedCategory}</span>
                </div>

                {/* Filter and Sort Controls - Mobile Only */}
                <div className="catalog-controls-mobile">
                    <button 
                        className="filters-btn"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <span>Filters</span>
                        <FiSliders />
                    </button>

                    <div className="sort-dropdown">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Newest</option>
                            <option value="rating">Rating</option>
                            <option value="priceDesc">Price High to Low</option>
                            <option value="priceAsc">Price Low to High</option>
                        </select>
                    </div>
                </div>

                {/* Filter Sidebar (Mobile Toggle) */}
                {showFilters && (
                    <div className="filter-sidebar-mobile">
                        <div className="catalogSidebar">
                            <h5 className="sidebarTitle">Filter by Price</h5>

                            <div className="priceBox">
                                <span>${minPrice.toFixed(2)}</span>
                                <span>${maxPrice.toFixed(2)}</span>
                            </div>

                            <div className="rangeContainer">
                                <input
                                    type="range"
                                    min={priceRange.min}
                                    max={priceRange.max}
                                    value={minPrice}
                                    onChange={(e) =>
                                        setMinPrice(
                                            Math.min(
                                                +e.target.value,
                                                maxPrice - GAP
                                            )
                                        )
                                    }
                                    className="thumb thumbLeft"
                                />

                                <input
                                    type="range"
                                    min={priceRange.min}
                                    max={priceRange.max}
                                    value={maxPrice}
                                    onChange={(e) =>
                                        setMaxPrice(
                                            Math.max(
                                                +e.target.value,
                                                minPrice + GAP
                                            )
                                        )
                                    }
                                    className="thumb thumbRight"
                                />

                                <div className="sliderTrack" />
                                <div
                                    className="sliderRange"
                                    style={{
                                        left: `${((minPrice - priceRange.min) /
                                            (priceRange.max - priceRange.min)) *
                                            100}%`,
                                        right: `${100 -
                                            ((maxPrice - priceRange.min) /
                                                (priceRange.max -
                                                    priceRange.min)) *
                                                100}%`,
                                    }}
                                />
                            </div>

                            <button className="applyBtn" onClick={applyFilter}>
                                Apply Filter
                            </button>
                        </div>
                    </div>
                )}

                {/* Desktop Layout with Sidebar */}
                <div className="catalog-layout-desktop">
                    {/* Sidebar - Desktop Only */}
                    <div className="catalog-sidebar-desktop">
                        <div className="catalogSidebar">
                            <h5 className="sidebarTitle">Filter by Price</h5>

                            <div className="priceBox">
                                <span>${minPrice.toFixed(2)}</span>
                                <span>${maxPrice.toFixed(2)}</span>
                            </div>

                            <div className="rangeContainer">
                                <input
                                    type="range"
                                    min={priceRange.min}
                                    max={priceRange.max}
                                    value={minPrice}
                                    onChange={(e) =>
                                        setMinPrice(
                                            Math.min(
                                                +e.target.value,
                                                maxPrice - GAP
                                            )
                                        )
                                    }
                                    className="thumb thumbLeft"
                                />

                                <input
                                    type="range"
                                    min={priceRange.min}
                                    max={priceRange.max}
                                    value={maxPrice}
                                    onChange={(e) =>
                                        setMaxPrice(
                                            Math.max(
                                                +e.target.value,
                                                minPrice + GAP
                                            )
                                        )
                                    }
                                    className="thumb thumbRight"
                                />

                                <div className="sliderTrack" />
                                <div
                                    className="sliderRange"
                                    style={{
                                        left: `${((minPrice - priceRange.min) /
                                            (priceRange.max - priceRange.min)) *
                                            100}%`,
                                        right: `${100 -
                                            ((maxPrice - priceRange.min) /
                                                (priceRange.max -
                                                    priceRange.min)) *
                                                100}%`,
                                    }}
                                />
                            </div>

                            <button className="applyBtn" onClick={applyFilter}>
                                Apply Filter
                            </button>
                        </div>
                    </div>

                    {/* Products Section */}
                    <div className="catalog-products-section">
                        {/* Products Result Count and Sort - Desktop */}
                        <div className="catalog-header-desktop">
                            <div className="products-result">
                                Products Result: <strong>{filteredProducts.length}</strong>
                            </div>

                            <div className="sort-dropdown-desktop">
                                <span>Sort By:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="newest">Newest</option>
                                    <option value="rating">Rating</option>
                                    <option value="priceDesc">Price High to Low</option>
                                    <option value="priceAsc">Price Low to High</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="catalog-products-grid">
                            {filteredProducts.map((p) => (
                                <div key={p.id} className="catalog-product-card">
                                    <div className="product-card-inner">
                                        <button className="wishlist-btn">
                                            <FiHeart />
                                        </button>
                                        
                                        <div 
                                            className="product-image-wrapper"
                                            onClick={() => window.location.href = `/product/${p.id}`}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <img src={p.image} alt={p.title} />
                                        </div>

                                        <div className="product-info">
                                            <h3 
                                                className="product-title"
                                                onClick={() => window.location.href = `/product/${p.id}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {p.title}
                                            </h3>
                                            <p className="product-price">${p.price}</p>
                                            <button 
                                                className="buy-now-btn"
                                                onClick={() => window.location.href = `/product/${p.id}`}
                                            >
                                                Buy Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Catalog;

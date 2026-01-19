import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductInfo from "../components/ProductInfo";
import ProductCard from "../components/ProductCard";
import { FiChevronRight } from "react-icons/fi";
import { env } from "../utils/env";



function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Breadcrumb component
    const Breadcrumb = ({ product }) => {
        const getCategoryDisplayName = (category) => {
            const categoryMap = {
                "men's clothing": "Men's Clothing",
                "women's clothing": "Women's Clothing",
                "jewelery": "Jewelry",
                "electronics": "Electronics"
            };
            return categoryMap[category] || category;
        };

        const getBrandFromTitle = (title) => {
            // Extract brand from product title (first word usually)
            const words = title.split(' ');
            return words[0];
        };

        return (
            <div className="breadcrumb-container">
                <nav className="breadcrumb-nav">
                    <Link to="/" className="breadcrumb-link">Home</Link>
                    <FiChevronRight className="breadcrumb-separator" />
                    <Link to="/catalog" className="breadcrumb-link">Catalog</Link>
                    <FiChevronRight className="breadcrumb-separator" />
                    <span className="breadcrumb-link">{getCategoryDisplayName(product.category)}</span>
                    <FiChevronRight className="breadcrumb-separator" />
                    <span className="breadcrumb-link">{getBrandFromTitle(product.title)}</span>
                    <FiChevronRight className="breadcrumb-separator" />
                    <span className="breadcrumb-active">{product.title}</span>
                </nav>
            </div>
        );
    };

    useEffect(() => {
        async function getProduct() {
            try {
                const res = await fetch(`${env.api.fakeStoreUrl}/products/${id}`);
                const data = await res.json();
                setProduct(data);

                if (data.category) {
                    const categoryRes = await fetch(`${env.api.fakeStoreUrl}/products/category/${data.category}`);
                    const categoryData = await categoryRes.json();

                    const filtered = categoryData
                        .filter(p => p.id !== data.id)
                        .slice(0, 4);

                    setRelatedProducts(filtered);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching product:", error);
                setLoading(false);
            }
        }
        getProduct();
    }, [id]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="product-detail-loading">Loading...</div>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Navbar />
                <div className="product-detail-error">Product not found</div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            {product && <Breadcrumb product={product} />}
            <ProductInfo product={product} />

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="related-products-section">
                    <div className="related-products-container">
                        <h2 className="related-products-title">Related Products</h2>
                        <div className="related-products-grid">
                            {relatedProducts.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    image={p.image}
                                    name={p.title}
                                    id={p.id}
                                    price={p.price}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ProductDetail;

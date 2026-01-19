import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductInfo from "../components/ProductInfo";
import ProductCard from "../components/ProductCard";


function ProductDetail() {


    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getProduct() {
            try {
                const res = await fetch(`https://fakestoreapi.com/products/${id}`);
                const data = await res.json();
                setProduct(data);
                
                if (data.category) {
                    const categoryRes = await fetch(`https://fakestoreapi.com/products/category/${data.category}`);
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

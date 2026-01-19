import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import CategorySlider from '../components/CategorySlider'
import SubHeader from '../components/SubHeader'
import ProductCard from '../components/ProductCard'
import AdProducts from '../components/AdProducts'
// import DiscountProducts from '../components/DiscountProducts'
import AdBanner from '../components/AdBanner'
import Footer from '../components/footer'




function Home() {

  const [activetab, setActivetab] = useState("new arrival");
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("electronics");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [discountproducts, setDiscountproducts] = useState([])


  useEffect(() => {
    async function getProducts() {
      const res = await fetch("https://fakestoreapi.com/products");
      const data = await res.json();
      setProducts(data);
    }
    getProducts();
  }, []);

  useEffect(() => {
    if (activetab === "new arrival") {
      setCategory("electronics");

    } else if (activetab === "best seller") {
      setCategory("men's clothing");
    } else if (activetab === "featured products") {
      setCategory("jewelery");
    }
  }, [activetab]);

  useEffect(() => {
    if (products.length > 0) {
      setDiscountproducts(products.slice(0, 4));
    }
  }, [products]);


  useEffect(() => {
    const filtered = products.filter(
      (product) => product.category === category
    );
    setFilteredProducts(filtered);
  }, [products, category]);

  return (
    <div>
      <Navbar />
      <Header />
      <SubHeader />
      <CategorySlider />

      <div className="container">
        <ul className='Products_tab_nav'>
          <li><p className={activetab === "new arrival" ? "productsTab_active" : ""} onClick={() => { setActivetab("new arrival") }}>New Arrival</p></li>
          <li><p className={activetab === "best seller" ? "productsTab_active" : ""} onClick={() => { setActivetab("best seller") }}>Best seller</p></li>
          <li><p className={activetab === "featured products" ? "productsTab_active" : ""} onClick={() => { setActivetab("featured products") }}>Featured Products</p></li>
        </ul>
        <div className="container my-5">
          <div className="row">
            {filteredProducts.map((p) => {
              return (<div className="col-6 col-md-3">
                <ProductCard image={p.image} name={p.title} id={p.id} price={p.price} />
              </div>)
            })}

          </div>
        </div>

      </div>
      <AdProducts />

      <div className="container my-5">
        <h3 className="fw-bold my-4">Discounts up to -50%</h3>

        <div className="row">
          {discountproducts.map((p) => {
            return (<div className="col-6 col-md-3">
              <ProductCard image={p.image} name={p.title} id={p.id} price={p.price} />
            </div>)
          })}

        </div>
      </div>
      <AdBanner />
      <Footer />
    </div>
  )
}

export default Home
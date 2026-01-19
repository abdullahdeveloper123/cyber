import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useState } from 'react';
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import Phones from '../assets/Phones.png'
import SmartWatch from "../assets/SmartWatches.png"
import Camera from "../assets/Cameras.png"
import Headphone from "../assets/Headphones (1).png"
import Desktop from "../assets/Computers.png"
import Games from "../assets/Gaming.png"
import Laptop from "../assets/laptop.png"
import Tools from "../assets/wrench.png"
import { useNavigate } from 'react-router-dom';



const CategorySlider = () => {
    let navigate=useNavigate()

    let [categoriesdata, setCategoriesdata] = useState([])

    async function fetchCategories() {
        let response = await fetch('https://fakestoreapi.com/products')


    }

    return (
        <div className="cateory_slider">
            <div className="container">

                <div className="category_slider_header">
                    <h2>Browse By Category</h2>
                    <div className="flex justify-end gap-3 mb-3">
                        <button className="prev-btn" style={{ border: "none" }}>  <MdChevronLeft size={30} /></button>
                        <button className="next-btn" style={{ border: "none" }}>  <MdChevronRight size={30} /></button>
                    </div>
                </div>
                <div className="category_slider_main">

                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={3}
                        navigation={{
                            prevEl: '.prev-btn',
                            nextEl: '.next-btn',
                        }}
                        autoplay={{ delay: 2500 }}
                        breakpoints={{
                            0: { slidesPerView: 2 },
                            768: { slidesPerView: 4 },
                            1024: { slidesPerView: 6 },
                        }}
                    >
                        <SwiperSlide><div className="category_item" onClick={()=>{navigate("/products/men's clothing")}}>
                            <img src={Phones} alt="" />
                            <p>Smart Phones</p>
                        </div></SwiperSlide>
                        <SwiperSlide><div className="category_item" onClick={()=>{navigate("/products/jewelery")}}>
                            <img src={SmartWatch} alt="" />
                            <p>Smart Watches</p>
                        </div></SwiperSlide>
                        <SwiperSlide><div className="category_item" onClick={()=>{navigate("/products/electronics")}}>
                            <img src={Camera} alt="" />
                            <p>Camera</p>
                        </div></SwiperSlide>
                        <SwiperSlide><div className="category_item" onClick={()=>{navigate("/products/women's clothing")}}>
                            <img src={Headphone} alt="" />
                            <p>Headphones</p>
                        </div></SwiperSlide>
                        <SwiperSlide><div className="category_item" onClick={()=>{navigate("/products/electronics")}}>
                            <img src={Desktop} alt="" />
                            <p>Computers</p>
                        </div></SwiperSlide>
                        <SwiperSlide><div className="category_item" onClick={()=>{navigate("/products/jewelery")}}>
                            <img src={Games} alt="" />
                            <p>Gaming</p>
                        </div></SwiperSlide>
                        <SwiperSlide><div className="category_item" onClick={()=>{navigate("/products/men's clothing")}}>
                            <img src={Laptop} alt="" style={{ width: "48px" }} />
                            <p>Laptops</p>
                        </div></SwiperSlide>
                        <SwiperSlide><div className="category_item" onClick={()=>{navigate("/products/women's clothing")}}>
                            <img src={Tools} alt="" style={{ width: "40px" }} />
                            <p>Tools</p>
                        </div></SwiperSlide>
                    </Swiper>
                </div>

            </div>

        </div>

    );
};

export default CategorySlider;

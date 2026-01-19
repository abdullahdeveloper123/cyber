import React from 'react'
import { Link } from 'react-router-dom';
import adWatch from "../assets/Group 1.png"
import Adipad from '../assets/ipad.png'
import Samsung from "../assets/samsungad.png"
import AdMac from "../assets/adMac.png"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css/pagination';
// Import Swiper styles
import 'swiper/css';

function AdProducts() {

    return (
        <div className='my-5'>
            <div className="row g-3" style={{ display: "none" }}>
                <div className="col-md-3">
                    <div className="adCard">
                        <img src={adWatch} style={{ padding: "16px 0" }} alt="" />
                        <h3>Popular Products</h3>
                        <p>iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.</p>
                        <Link to="/catalog">Shop Now</Link>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="adCard">
                        <img src={Adipad} alt="" />
                        <h3>Ipad Pro</h3>
                        <p>iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.</p>
                        <a href="">Shop Now</a>
                    </div>
                </div>
                <div className="col-md-3" style={{ background: "#EAEAEA" }}>
                    <div className="adCard">
                        <img src={Samsung} alt="" />
                        <h3>Samsung Galaxy </h3>
                        <p>iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.</p>
                        <a href="">Shop Now</a>
                    </div>
                </div>
                <div className="col-md-3" style={{ background: "#2C2C2C" }}>
                    <div className="adCard last_ad_child">
                        <img src={AdMac} alt="" />
                        <h3>Macbook Pro</h3>
                        <p>iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.</p>
                        <a href="">Shop Now</a>
                    </div>
                </div>
            </div>
            <div className="sm_ad_slider" style={{ display: 'block' }}>
                <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={3}
                    navigation={{
                        prevEl: '.prev-btn',
                        nextEl: '.next-btn',
                    }}
                    autoplay={{ delay: 2500 }}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        768: { slidesPerView: 1 },
                        1024: { slidesPerView: 4 },
                    }}
                >
                    <SwiperSlide>  <div className="adCard">
                        <img src={adWatch} style={{ padding: "16px 0" }} alt="" />
                        <h3>Popular Products</h3>
                        <p>iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.</p>
                        <a href="">Shop Now</a>
                    </div></SwiperSlide>
                    <SwiperSlide> <div className="adCard">
                        <img src={Adipad} alt="" />
                        <h3>Ipad Pro</h3>
                        <p>iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.</p>
                        <a href="">Shop Now</a>
                    </div></SwiperSlide>

                    <SwiperSlide><div className="adCard">
                        <img src={Samsung} alt="" />
                        <h3>Samsung Galaxy </h3>
                        <p>iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.</p>
                        <a href="">Shop Now</a>
                    </div></SwiperSlide>
                    <SwiperSlide>
                        <div className="wrapper" style={{ background: "#2C2C2C" }}>


                            <div className="adCard last_ad_child" >
                                <img src={AdMac} alt="" />
                                <h3>Macbook Pro</h3>
                                <p>iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.</p>
                                <a href="">Shop Now</a>
                            </div>
                        </div></SwiperSlide>

                </Swiper>
            </div>
        </div>
    )
}

export default AdProducts
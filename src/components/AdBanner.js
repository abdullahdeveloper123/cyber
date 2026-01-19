import { Link } from 'react-router-dom'
import React from 'react'
import img1 from "../assets/vertical.png"
import img2 from "../assets/blue-tablet.png"
import img3 from "../assets/iphonepro.png"
import img4 from "../assets/image 7.png"
import img5 from "../assets/orignal-flap-r.png"




function AdBanner() {
    return (
        <div>
            <div className="adBanner">
                <img src={img1} alt="" className='left-img1' />
                <img src={img2} alt="" className='left-img2' />

                <img src={img3} alt="" className='right-img1' />
                <img src={img4} alt="" className='right-img2' />
                <img src={img5} alt="" className='top-img1' />
                <div className="text-banner">
                    <h3>Big Summer <span className='fw-bold'>Sale</span> </h3>
                    <p>Commodo fames vitae vitae leo mauris in. Eu consequat.</p>
                    <Link to="/catalog">Shop Now</Link>
                </div>
            </div>
        </div>
    )
}

export default AdBanner
import React from 'react'
import WplayStation from '../assets/WPlayStation.png'
import WMacBookPro from "../assets/WMacBookPro.png"
import Wairpods from "../assets/Wairpods.png"
import Wvisionpro from "../assets/Wvisionpro.png"
import SplayStation from '../assets/Splaystationhead.png'
import SMacBookPro from "../assets/Smacbookhead.png"
import Sairpods from "../assets/Sairpods.png"
import Svisionpro from "../assets/Sapplevisionhead.png"
 

function SubHeader() {
    return (
        <div>
            <div className="subheader-main">
                <div className="subheader-grid">
                    <div className="box-1" style={{gridArea:"box-1"}}>
                        <img src={WplayStation} className='lg-img' alt="" />
                         <img src={SplayStation} className='sm-img' alt="" />
                        <div className="text-wrapper">
                            <h2>Playstation 5</h2>
                            <p>Incredibly powerful CPUs, GPUs, and an SSD with integrated I/O will redefine your PlayStation experience.</p>
                        </div>
                    </div>
                    <div className="box-2" style={{gridArea:"box-2"}}>
                        <img src={Wairpods}  className='lg-img' alt="" />
                        <img src={Sairpods}  className='sm-img' alt="" />
                        <div className="text-wrapper">
                            <h2><span style={{fontWeight:"400"}}>Apple AirPods</span> <span>Max</span>
                            </h2>
                            <p>Computational audio. Listen, it's powerful.</p>
                        </div>
                    </div>
                    <div className="box-3" style={{gridArea:"box-3"}}>
                        <img src={Wvisionpro} alt=""  className='lg-img'/>
                        <img src={Svisionpro} alt=""  className='sm-img'/>
                        <div className="text-wrapper">
                            <h2> <span style={{fontWeight:"400"}}>Apple Vision </span><span>Pro</span></h2>

                            <p>An immersive way to experience entertainment.</p>
                        </div>
                    </div>

                </div>
                <div className="right">
                    <img src={WMacBookPro} alt="" className='lg-img'/>
                    <img src={SMacBookPro} alt="" className='sm-img' />

                    <div className="text-wrapper">
                        <h2><span style={{fontWeight:"400"}}>MacBook</span> Air</h2>
                        <p>The new 15‑inch MacBook Air makes room for more of what you love with a spacious Liquid Retina display.</p>
                        <a href="">Shop Now</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubHeader
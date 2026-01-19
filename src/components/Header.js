import React from 'react'
import headerIphone from '../assets/headerIphone.png'

function Header() {
    return (
        <header className="header-section">
            <div className="container">
                <div className="row align-items-center header-row">
                    <div className="col-md-6 order-2 order-md-1">
                        <div className="header-content text-center text-md-start">
                            <p className="header-subtitle">Pro.Beyond.</p>
                            <p className="header-title"><span style={{fontWeight:"300"}}>IPhone 14 </span><strong>Pro</strong></p>
                            <p className="header-description">Created to change everything for the better. For everyone</p>
                            <div>
                                <a href="#" className="btn-shop-outline">Shop Now</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 order-1 order-md-2">
                        <div className="header-image-container">
                            <img
                                src={headerIphone}
                                alt="iPhone 14 Pro"
                                className="header-image"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
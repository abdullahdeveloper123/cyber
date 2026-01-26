import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { FiPlus, FiEdit2, FiX, FiMapPin, FiTruck, FiCreditCard } from "react-icons/fi";

function Checkout() {
    const [currentStep, setCurrentStep] = useState(3);
    const [selectedAddress, setSelectedAddress] = useState(0);
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            name: "2118 Thornridge",
            label: "Default",
            fullAddress: "2118 Thornridge Cir Syracuse, Connecticut 35624",
            phone: "(209) 555-0104"
        },
        {
            id: 2,
            name: "Headoffice",
            label: "",
            fullAddress: "2715 Ash Dr, San Jose, South Dakota 83475",
            phone: "(704) 555-0127"
        }
    ]);
    const [cartItems, setCartItems] = useState([]);

    // Payment form state
    const [paymentForm, setPaymentForm] = useState({
        cardholderName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    // Payment method tab state
    const [activePaymentTab, setActivePaymentTab] = useState('creditCard');

    const { user } = useAuth();
    const navigate = useNavigate();

    // Format card number with spaces and fill remaining with placeholder
    const getDisplayCardNumber = () => {
        if (!paymentForm.cardNumber) return '0000 0000 0000 0000';

        const cleanNumber = paymentForm.cardNumber.replace(/\s/g, '');
        const paddedNumber = cleanNumber.padEnd(16, '0');

        return paddedNumber.match(/.{1,4}/g).join(' ');
    };

    // Format card number with spaces
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    // Format expiry date MM/YY
    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    // Format CVV (3 digits only)
    const formatCVV = (value) => {
        return value.replace(/[^0-9]/gi, '').substring(0, 3);
    };

    // Handle input changes with formatting
    const handleInputChange = (field, value) => {
        let formattedValue = value;

        switch (field) {
            case 'cardNumber':
                formattedValue = formatCardNumber(value);
                break;
            case 'expiryDate':
                formattedValue = formatExpiryDate(value);
                break;
            case 'cvv':
                formattedValue = formatCVV(value);
                break;
            default:
                formattedValue = value;
        }

        setPaymentForm(prev => ({
            ...prev,
            [field]: formattedValue
        }));
    };

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        // Load cart from localStorage
        const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(savedCart);

        if (savedCart.length === 0) {
            navigate("/cart");
        }
    }, [user, navigate]);



    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else if (currentStep === 3) {
            // Complete the order
            completeOrder();
        }
    };

    const completeOrder = () => {
        // Create order from cart
        const newOrder = {
            id: `ORD-${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            userId: user?.uid,
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            status: 'Processing',
            items: cartItems,
            shipping: {
                method: 'Standard Delivery',
                address: addresses[selectedAddress]?.fullAddress || 'Address not specified'
            },
            total: cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0) + 79 // Including tax and shipping
        };

        // Save order to localStorage
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        existingOrders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(existingOrders));

        // Clear cart
        localStorage.setItem('cart', JSON.stringify([]));

        // Show success message and redirect
        alert(`Order ${newOrder.id} has been placed successfully!`);
        navigate('/profile');
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate("/cart");
        }
    };

    const addNewAddress = () => {
        // This would open an address form modal/page
        console.log("Add new address");
    };

    const editAddress = (addressId) => {
        // This would open an edit address form
        console.log("Edit address:", addressId);
    };

    const removeAddress = (addressId) => {
        setAddresses(addresses.filter(addr => addr.id !== addressId));
    };

    if (!user) {
        return null;
    }

    return (
        <>
            <Navbar />
            <div className="checkout-page">
                <div className="checkout-container">
                    {/* Progress Steps */}
                    <div className="checkout-steps">
                        <div className="step-item">
                            <div className={`step-circle ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                                {currentStep > 1 ? '✓' : <FiMapPin />}
                            </div>
                            <div className="step-info">
                                <span className="step-number">Step 1</span>
                                <span className="step-title">Address</span>
                            </div>
                            <div className={`step-connector ${currentStep > 1 ? 'completed' : ''}`}></div>
                        </div>

                        <div className="step-item">
                            <div className={`step-circle ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                                {currentStep > 2 ? '✓' : <FiTruck />}
                            </div>
                            <div className="step-info">
                                <span className="step-number">Step 2</span>
                                <span className="step-title">Shipping</span>
                            </div>
                            <div className={`step-connector ${currentStep > 2 ? 'completed' : ''}`}></div>
                        </div>

                        <div className="step-item">
                            <div className={`step-circle ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
                                {currentStep > 3 ? '✓' : <FiCreditCard />}
                            </div>
                            <div className="step-info">
                                <span className="step-number">Step 3</span>
                                <span className="step-title">Payment</span>
                            </div>
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="checkout-content">
                        {currentStep === 1 && (
                            <div className="address-step">
                                <h2 className="step-heading">Select Address</h2>

                                <div className="address-list">
                                    {addresses.map((address, index) => (
                                        <div
                                            key={address.id}
                                            className={`address-card ${selectedAddress === index ? 'selected' : ''}`}
                                            onClick={() => setSelectedAddress(index)}
                                        >
                                            <div className="address-radio">
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    checked={selectedAddress === index}
                                                    onChange={() => setSelectedAddress(index)}
                                                />
                                            </div>

                                            <div className="address-content">
                                                <div className="address-header">
                                                    <span className="address-name">{address.name}</span>
                                                    {address.label && (
                                                        <span className="address-label">{address.label}</span>
                                                    )}
                                                </div>
                                                <div className="address-details">
                                                    <p className="address-full">{address.fullAddress}</p>
                                                    <p className="address-phone">{address.phone}</p>
                                                </div>
                                            </div>

                                            <div className="address-actions">
                                                <button
                                                    className="address-action-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        editAddress(address.id);
                                                    }}
                                                >
                                                    <FiEdit2 />
                                                </button>
                                                <button
                                                    className="address-action-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeAddress(address.id);
                                                    }}
                                                >
                                                    <FiX />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add New Address */}
                                    <div className="add-address-card" onClick={addNewAddress}>
                                        <FiPlus className="add-icon" />
                                        <span>Add New Address</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="shipping-step">
                                <h2 className="step-heading">Select Shipping Method</h2>
                                <div className="shipping-options">
                                    <div className="shipping-option">
                                        <input type="radio" name="shipping" id="standard" defaultChecked />
                                        <label htmlFor="standard">
                                            <div className="shipping-info">
                                                <span className="shipping-name">Standard Delivery</span>
                                                <span className="shipping-time">5-7 business days</span>
                                            </div>
                                            <span className="shipping-price">Free</span>
                                        </label>
                                    </div>
                                    <div className="shipping-option">
                                        <input type="radio" name="shipping" id="express" />
                                        <label htmlFor="express">
                                            <div className="shipping-info">
                                                <span className="shipping-name">Express Delivery</span>
                                                <span className="shipping-time">2-3 business days</span>
                                            </div>
                                            <span className="shipping-price">$15.00</span>
                                        </label>
                                    </div>
                                    <div className="shipping-option">
                                        <input type="radio" name="shipping" id="overnight" />
                                        <label htmlFor="overnight">
                                            <div className="shipping-info">
                                                <span className="shipping-name">Overnight Delivery</span>
                                                <span className="shipping-time">Next business day</span>
                                            </div>
                                            <span className="shipping-price">$25.00</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="payment-step">
                                <div className="payment-layout">
                                    {/* Left Side - Summary */}
                                    <div className="payment-summary">
                                        <h3 className="summary-title">Summary</h3>

                                        {/* Cart Items */}
                                        <div className="summary-items">
                                            {cartItems.map((item) => (
                                                <div key={item.id} className="summary-item">
                                                    <div className="summary-item-image">
                                                        <img src={item.image} alt={item.title} />
                                                    </div>
                                                    <div className="summary-item-info">
                                                        <span className="summary-item-name">
                                                            {item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title}
                                                        </span>
                                                        <span className="summary-item-price">${item.price}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Address */}
                                        <div className="summary-section">
                                            <h4>Address</h4>
                                            <p>{addresses[selectedAddress]?.fullAddress}</p>
                                        </div>

                                        {/* Shipment Method */}
                                        <div className="summary-section">
                                            <h4>Shipment method</h4>
                                            <p>Standard Delivery - $29.00</p>
                                        </div>

                                        {/* Price Breakdown */}
                                        <div className="summary-totals">
                                            <div className="summary-row">
                                                <span>Subtotal</span>
                                                <span>${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
                                            </div>
                                            <div className="summary-row">
                                                <span>Estimated Tax</span>
                                                <span>$50</span>
                                            </div>
                                            <div className="summary-row">
                                                <span>Estimated shipping & Handling</span>
                                                <span>$29</span>
                                            </div>
                                            <div className="summary-row total-row">
                                                <span>Total</span>
                                                <span>${(cartItems.reduce((total, item) => total + (item.price * item.quantity), 0) + 79).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side - Payment */}
                                    <div className="payment-form-section">
                                        <h3 className="payment-title">Payment</h3>

                                        {/* Payment Method Tabs */}
                                        <div className="payment-tabs">
                                            <button
                                                className={`payment-tab ${activePaymentTab === 'creditCard' ? 'active' : ''}`}
                                                onClick={() => setActivePaymentTab('creditCard')}
                                            >
                                                Credit Card
                                            </button>
                                            <button
                                                className={`payment-tab ${activePaymentTab === 'paypal' ? 'active' : ''}`}
                                                onClick={() => setActivePaymentTab('paypal')}
                                            >
                                                PayPal
                                            </button>
                                            <button
                                                className={`payment-tab ${activePaymentTab === 'paypalCredit' ? 'active' : ''}`}
                                                onClick={() => setActivePaymentTab('paypalCredit')}
                                            >
                                                PayPal Credit
                                            </button>
                                        </div>

                                        {/* Payment Content Based on Active Tab */}
                                        {activePaymentTab === 'creditCard' && (
                                            <>
                                                {/* Credit Card Visual */}
                                                <div className="credit-card-visual">
                                                    <div className="card-chip"></div>
                                                    <div className="card-logo">
                                                        <div className="mastercard-logo">
                                                            <div className="circle red"></div>
                                                            <div className="circle yellow"></div>
                                                        </div>
                                                    </div>
                                                    <div className="card-number">
                                                        {getDisplayCardNumber()}
                                                    </div>
                                                    <div className="card-info">
                                                        <span className="card-holder">
                                                            {paymentForm.cardholderName || 'Cardholder'}
                                                        </span>
                                                        <span className="card-expiry">
                                                            {paymentForm.expiryDate || 'MM/YY'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Payment Form */}
                                                <div className="payment-form">
                                                    <div className="form-group">
                                                        <label>Cardholder Name</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter cardholder name"
                                                            value={paymentForm.cardholderName}
                                                            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label>Card Number</label>
                                                        <input
                                                            type="text"
                                                            placeholder="0000 0000 0000 0000"
                                                            value={paymentForm.cardNumber}
                                                            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                                                            maxLength="19"
                                                            inputMode="numeric"
                                                        />
                                                    </div>

                                                    <div className="form-row">
                                                        <div className="form-group">
                                                            <label>Exp Date</label>
                                                            <input
                                                                type="text"
                                                                placeholder="MM/YY"
                                                                value={paymentForm.expiryDate}
                                                                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                                                                maxLength="5"
                                                                inputMode="numeric"
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>CVV</label>
                                                            <input
                                                                type="text"
                                                                placeholder="123"
                                                                value={paymentForm.cvv}
                                                                onChange={(e) => handleInputChange('cvv', e.target.value)}
                                                                maxLength="3"
                                                                inputMode="numeric"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="form-checkbox">
                                                        <input type="checkbox" id="same-billing" />
                                                        <label htmlFor="same-billing">Same as billing address</label>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {activePaymentTab === 'paypal' && (
                                            <div className="paypal-content">
                                                <div className="paypal-info">
                                                    <div className="paypal-logo">
                                                        <span className="paypal-blue">Pay</span>
                                                        <span className="paypal-light-blue">Pal</span>
                                                    </div>
                                                    <p>You will be redirected to PayPal to complete your payment securely.</p>
                                                    <div className="paypal-benefits">
                                                        <div className="benefit-item">
                                                            <span>✓</span>
                                                            <span>Secure payment processing</span>
                                                        </div>
                                                        <div className="benefit-item">
                                                            <span>✓</span>
                                                            <span>Buyer protection</span>
                                                        </div>
                                                        <div className="benefit-item">
                                                            <span>✓</span>
                                                            <span>No need to enter card details</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activePaymentTab === 'paypalCredit' && (
                                            <div className="paypal-credit-content">
                                                <div className="paypal-credit-info">
                                                    <div className="paypal-credit-logo">
                                                        <span className="paypal-blue-small">PayPal</span>
                                                        <span className="paypal-light-blue-small"> Credit</span>
                                                    </div>
                                                    <p>Pay in 4 interest-free payments or get special financing offers.</p>
                                                    <div className="paypal-credit-benefits">
                                                        <div className="benefit-item">
                                                            <span>✓</span>
                                                            <span>No interest if paid in full in 6 months</span>
                                                        </div>
                                                        <div className="benefit-item">
                                                            <span>✓</span>
                                                            <span>Pay in 4 installments</span>
                                                        </div>
                                                        <div className="benefit-item">
                                                            <span>✓</span>
                                                            <span>Subject to credit approval</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="checkout-navigation">
                        <button className="nav-btn back-btn" onClick={handleBack}>
                            Back
                        </button>
                        <button className="nav-btn next-btn" onClick={handleNext}>
                            {currentStep === 3 ?
                                (activePaymentTab === 'creditCard' ? 'Pay' :
                                    activePaymentTab === 'paypal' ? 'Continue with PayPal' :
                                        'Continue with PayPal Credit')
                                : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Checkout;
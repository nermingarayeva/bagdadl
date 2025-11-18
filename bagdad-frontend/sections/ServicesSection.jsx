import React from 'react';
import { FaCookieBite, FaShippingFast, FaBirthdayCake } from 'react-icons/fa';
import '../src/assets/images/styles/global.css';
import { GiChocolateBar } from 'react-icons/gi';

const ServicesSection = () => {
  return (
    <section className="services-section">
      <div className="services-content">
        <h2>Our Services</h2>
        <div className="services-grid">
          <div className="service-item">
            <FaCookieBite className="service-icon" />
            <h3>Freshly Cookies</h3>
            <p>Delicious cookies made with love and fresh ingredients.</p>
          </div>

          <div className="service-item">
            <FaShippingFast className="service-icon" />
            <h3>Fast Delivery</h3>
            <p>Get your cookies delivered to your door in no time.</p>
          </div>

          <div className="service-item">
            <GiChocolateBar 
            className="service-icon" />
            <h3>Custom Orders</h3>
            <p>Order custom cookies for your special events or celebrations.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

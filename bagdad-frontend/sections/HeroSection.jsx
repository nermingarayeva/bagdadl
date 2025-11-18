import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../src/assets/images/styles/global.css';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate('/products'); // ProductsPage route-u
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Welcome to Our Cookie Website</h1>
        <p>Enjoy our delicious cookies and explore our collection</p>
        <button className="cta-button" onClick={handleExplore}>
          Explore Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import LanguageSwitcher from "../LanguageSwitcher";
import {
  PiInstagramLogo,
  PiFacebookLogo,
  PiTiktokLogo,
  PiYoutubeLogo,
  PiTelegramLogo,
  PiShoppingCartSimple,
} from "react-icons/pi";
import { HiMenu, HiX } from "react-icons/hi";
import "../assets/images/styles/global.css";

const Header = () => {
  const { t } = useTranslation();
  const [isHidden, setIsHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Redux-dan səbət məlumatı
  const cartItems = useSelector((state) => state.cart?.items || []);
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={`navbar ${isHidden ? "hidden" : ""}`}>
      <div className="navhead">
        <div className="contact">
          <a href="https://www.instagram.com/bagdad.azerbaijan">
            <PiInstagramLogo />
          </a>
          <a href="https://www.facebook.com/share/1FQF5GFEMz/">
            <PiFacebookLogo />
          </a>
          <a href="https://www.tiktok.com/@bagdad.azerbaijan">
            <PiTiktokLogo />
          </a>
          <a href="https://youtube.com/@bagdad.azerbaijan">
            <PiYoutubeLogo />
          </a>
          <a href="https://t.me/bagdadazerbaijan">
            <PiTelegramLogo />
          </a>
        </div>

        <div className="head">
          <p>min dad, bir hekayə</p>
        </div>

        <div className="right">
          <LanguageSwitcher />
          
          {/* Səbət İkonu */}
          <Link to="/basket" className="cart-icon">
            <PiShoppingCartSimple size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>

      <div className="nav">
        <img src="../logo.png" alt="Logo" />
      </div>

      {/* Navigation with Burger */}
      <div className="pages">
        {/* Burger Button */}
        <button 
          className="burger-btn" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>

        <nav className="desktop-nav">
          <Link to="/">{t("Home")}</Link>
          <Link to="/products">{t("ProductsPage")}</Link>
          <Link to="/category/:category">{t("Categories")}</Link>
          <Link to="/blogs">{t("Blogs")}</Link>
          <Link to="/campaigns">{t("Campaigns")}</Link>
          <Link to="/customisedgifts">{t("Customised Gifts")}</Link>
        </nav>

        {/* Mobile Menu */}
        <nav className={`mobile-nav ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={closeMenu}>{t("Home")}</Link>
          <Link to="/products" onClick={closeMenu}>{t("ProductsPage")}</Link>
          <Link to="/category/:category" onClick={closeMenu}>{t("Categories")}</Link>
          <Link to="/blogs" onClick={closeMenu}>{t("Blogs")}</Link>
          <Link to="/campaigns" onClick={closeMenu}>{t("Campaigns")}</Link>
          <Link to="/customisedgifts" onClick={closeMenu}>{t("Customised Gifts")}</Link>
          
          {/* Mobile-də səbət */}
          <Link to="/cart" onClick={closeMenu} className="mobile-cart-link">
            🛒 Səbət ({cartCount})
          </Link>
        </nav>
      </div>

      {menuOpen && <div className="overlay" onClick={closeMenu}></div>}
    </div>
  );
};

export default Header;
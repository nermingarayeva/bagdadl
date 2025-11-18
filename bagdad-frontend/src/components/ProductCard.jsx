import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import "../assets/images/styles/global.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Səbətdə bu məhsulun olub-olmamasını yoxla
  const cartItems = useSelector((state) => state.cart?.items || []);
  const isInCart = cartItems.some((item) => item._id === product._id);

  const handleViewDetails = () => {
    navigate(`/product/${product._id}`);
  };

  const handleCartAction = (e) => {
    e.stopPropagation(); // Kartın özünə klik olmasın
    
    if (isInCart) {
      // Artıq səbətdədirsə, səbətə get
      navigate("/basket");
    } else {
      // Səbətdə deyilsə, əlavə et
      dispatch(addToCart(product));
      // Alert-i sildik, sadəcə əlavə edir
    }
  };

  return (
    <div className="product-card" onClick={handleViewDetails}>
      <div className="product-image">
        <img 
          src={`http://localhost:5000${product.image}`} 
          alt={product.name} 
        />
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price} ₼</p>
        
        <div className="product-actions">
          <button 
            className="btn-view-details"
            onClick={handleViewDetails}
          >
            Ətraflı Bax
          </button>
          
          <button 
            className={`btn-add-to-cart ${isInCart ? "in-cart" : ""}`}
            onClick={handleCartAction}
          >
            {isInCart ? "✓ Səbətə Get" : "🛒 Səbətə Əlavə Et"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
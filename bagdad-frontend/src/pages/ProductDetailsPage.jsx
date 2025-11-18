import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import axios from "axios";
import "../assets/images/styles/global.css";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imageZoomed, setImageZoomed] = useState(false); // Şəkil zoom state

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("Fetching product with ID:", id);
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        console.log("Product response:", response.data);
        setProduct(response.data);
      } catch (error) {
        console.error("Məhsul yüklənmədi:", error);
        console.error("Error response:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, quantity }));
      alert("Məhsul səbətə əlavə edildi!");
    }
  };

  const handleBuyNow = () => {
    console.log("İndi Al clicked!");
    console.log("Product:", product);
    console.log("Quantity:", quantity);
    
    if (product) {
      navigate("/checkout", { state: { product, quantity } });
    } else {
      console.error("Product is null!");
    }
  };

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (loading) {
    return <div className="loading">Yüklənir...</div>;
  }

  if (!product) {
    return <div className="error">Məhsul tapılmadı!</div>;
  }

  return (
    <div className="product-details-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Geri Qayıt
      </button>

      <div className="product-details">
        <div 
          className={`product-image-large ${imageZoomed ? 'zoomed' : ''}`}
          onClick={() => setImageZoomed(!imageZoomed)}
        >
          <img src={`http://localhost:5000${product.image}`} alt={product.name} />
        </div>

        <div className="product-info-detailed">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-price-section">
            <span className="price">{product.price} ₼</span>
          </div>

          <div className="product-description">
            <h3>Məhsul Haqqında</h3>
            <p>{product.description || "Təsvir mövcud deyil"}</p>
          </div>

          <div className="product-specifications">
            <h3>Xüsusiyyətlər</h3>
            <ul>
              <li><strong>Kategoriya:</strong> {product.category || "Ümumi"}</li>
              <li><strong>Stok:</strong> {product.stock ? "Mövcuddur" : "Tükənib"}</li>
              <li><strong>Brend:</strong> {product.brand || "Məlum deyil"}</li>
            </ul>
          </div>

          <div className="quantity-selector">
            <label>Miqdar:</label>
            <div className="quantity-controls">
              <button onClick={() => handleQuantityChange("decrease")}>−</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange("increase")}>+</button>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-add-to-cart-large" onClick={handleAddToCart}>
               Səbətə Əlavə Et
            </button>
            <button className="btn-buy-now" onClick={handleBuyNow}>
               İndi Al
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
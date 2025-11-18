import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/images/styles/global.css";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, quantity } = location.state || {};

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("Səhər");
  const [paymentMethod, setPaymentMethod] = useState("Kart");
  const [message, setMessage] = useState("");

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhone(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !surname || !phone || !address) {
      alert("Zəhmət olmasa bütün məlumatları doldurun!");
      return;
    }

    // Sifariş məlumatı
    const orderData = {
      name: `${name} ${surname}`,
      phone,
      address,
      deliveryTime,
      paymentMethod,
      message,
      product: {
        name: product.name,
        price: product.price,
        quantity: quantity,
        total: product.price * quantity,
      },
    };

    try {
      // Backend-ə göndər
      await axios.post("http://localhost:5000/api/orders", orderData);

      // WhatsApp mesajı
      const orderMessage = `🛍️ Yeni Sifariş

👤 Ad Soyad: ${orderData.name}
📞 Telefon: ${phone}
🏠 Ünvan: ${address}
🕐 Çatdırılma Vaxtı: ${deliveryTime}
💳 Ödəniş: ${paymentMethod}
💌 Mesaj: ${message || "Yoxdur"}

📦 Məhsul: ${product.name}
💰 Qiymət: ${product.price} ₼
🔢 Miqdar: ${quantity}
💵 Toplam: ${product.price * quantity} ₼`;

      const adminNumber = "994993469313";
      const whatsappLink = `https://wa.me/${adminNumber}?text=${encodeURIComponent(
        orderMessage
      )}`;

      // WhatsApp aç
      window.open(whatsappLink, "_blank");

      alert("Sifariş uğurla göndərildi!");
      
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Sifariş xətası:", err);
      alert("Sifariş göndərilə bilmədi!");
    }
  };

  if (!product) {
    return (
      <div className="checkout-error">
        <h2>Məhsul tapılmadı!</h2>
        <button onClick={() => navigate("/")}>Ana Səhifəyə Qayıt</button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Geri Qayıt
      </button>

      <div className="checkout-container">
        {/* Sol tərəf - Sifariş Formu */}
        <div className="checkout-form">
          <h1>Sifariş Məlumatları</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Ad *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız"
                required
              />
            </div>

            <div className="form-group">
              <label>Soyad *</label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Soyadınız"
                required
              />
            </div>

            <div className="form-group">
              <label>Telefon *</label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="994xxxxxxxxx"
                maxLength="12"
                pattern="[0-9]*"
                inputMode="numeric"
                required
              />
            </div>

            <div className="form-group">
              <label>Ünvan *</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Çatdırılma ünvanı"
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>Çatdırılma Vaxtı</label>
              <select
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
              >
                <option value="Səhər">Səhər (09:00-12:00)</option>
                <option value="Günorta">Günorta (12:00-17:00)</option>
                <option value="Axşam">Axşam (17:00-21:00)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Ödəniş Üsulu</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Kart">Kart ilə</option>
                <option value="Nəğd">Nəğd</option>
              </select>
            </div>

            <div className="form-group">
              <label>Mesaj (İstəyə Görə)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Əlavə qeyd və ya mesajınız"
                rows="4"
              />
            </div>

            <button type="submit" className="btn-submit-order">
              📱 Sifarişi Təsdiqlə (WhatsApp)
            </button>
          </form>
        </div>

        {/* Sağ tərəf - Sifariş Xülasəsi */}
        <div className="checkout-summary">
          <h2>Sifariş Xülasəsi</h2>

          <div className="summary-product">
            <img
              src={`http://localhost:5000${product.image}`}
              alt={product.name}
            />
            <div className="summary-product-info">
              <h3>{product.name}</h3>
              <p className="summary-price">{product.price} ₼</p>
              <p className="summary-quantity">Miqdar: {quantity}</p>
            </div>
          </div>

          <div className="summary-details">
            <div className="summary-row">
              <span>Məhsul Qiyməti:</span>
              <span>{product.price} ₼</span>
            </div>
            <div className="summary-row">
              <span>Miqdar:</span>
              <span>×{quantity}</span>
            </div>
            <div className="summary-row">
            </div>
            <div className="summary-total">
              <span>Toplam:</span>
              <span>{product.price * quantity} ₼</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
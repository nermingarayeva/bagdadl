import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { increaseQuantity, decreaseQuantity, removeItem } from "../redux/cartSlice";

const BasketPage = () => {
  const basket = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryTime: "",
    message: "",
    paymentMethod: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const totalAmount = basket.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleOrder = () => {
    if (basket.length === 0) {
      alert("Səbət boşdur!");
      return;
    }

    if (!form.name || !form.phone || !form.address || !form.paymentMethod) {
      alert("Zəhmət olmasa bütün xanaları doldurun!");
      return;
    }

    const adminNumber = "994993469313";

    let message =
      `🧾 *Yeni Səbət Sifarişi*\n\n` +
      `👤 Ad Soyad: ${form.name}\n` +
      `📞 Telefon: ${form.phone}\n` +
      `📍 Ünvan: ${form.address}\n` +
      `⏰ Çatdırılma vaxtı: ${form.deliveryTime || "Göstərilməyib"}\n` +
      `💳 Ödəniş: ${form.paymentMethod}\n` +
      `💬 Qeyd: ${form.message || "Yoxdur"}\n\n` +
      `🛒 *Məhsullar:* \n\n`;

    basket.forEach((item, idx) => {
      message += `#${idx + 1}\n📦 ${item.name}\n🔢 Miqdar: ${
        item.quantity
      }\n💰 Qiymət: ${item.price} ₼\n📦 Cəmi: ${
        item.price * item.quantity
      } ₼\n\n`;
    });

    message += `💵 *Yekun: ${totalAmount} ₼*`;

    const whatsappLink = `https://wa.me/${adminNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappLink, "_blank");
  };

  return (
    <div style={{ padding: "30px 70px" }}>
      <h1>Səbət</h1>

      {basket.length === 0 ? (
        <p>Səbət boşdur.</p>
      ) : (
        <>
          {basket.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                gap: "15px",
                marginBottom: "25px",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                alignItems: "center",
              }}
            >
              <img
                src={`http://localhost:5000${item.image}`}
                alt={item.name}
                style={{ width: "100px", borderRadius: "8px" }}
              />

              <div style={{ flex: 1 }}>
                <h3>{item.name}</h3>
                <p>Qiymət: {item.price} ₼</p>

                {/* Miqdar artır/azalt */}
                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                  <button
                    onClick={() => dispatch(decreaseQuantity(item._id))}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "5px",
                      fontSize: "18px",
                    }}
                  >
                    -
                  </button>

                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => dispatch(increaseQuantity(item._id))}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "5px",
                      fontSize: "18px",
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Səbətdən sil */}
                <button
                  onClick={() => dispatch(removeItem(item._id))}
                  style={{
                    marginTop: "10px",
                    padding: "5px 10px",
                    background: "red",
                    color: "white",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Məhsulu sil
                </button>
              </div>

              <div>
                <strong>Cəmi: {item.price * item.quantity} ₼</strong>
              </div>
            </div>
          ))}

          {/* Ümumi məbləğ göstəricisi */}
          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              background: "#f0f8ff",
              borderRadius: "10px",
              border: "2px solid #4CAF50",
              textAlign: "right",
            }}
          >
            <h2 style={{ margin: 0, color: "#2e7d32" }}>
              Ümumi məbləğ: {totalAmount.toFixed(2)} ₼
            </h2>
          </div>
        </>
      )}

      {/* Checkout formu */}
      {basket.length > 0 && (
        <div style={{ marginTop: "35px" }}>
          <h2>Sifariş Məlumatları</h2>

          <div className="checkout-form">
            <input
              type="text"
              name="name"
              placeholder="Ad Soyad"
              value={form.name}
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Telefon"
              value={form.phone}
              onChange={handleChange}
            />

            <input
              type="text"
              name="address"
              placeholder="Ünvan"
              value={form.address}
              onChange={handleChange}
            />

            <input
              type="text"
              name="deliveryTime"
              placeholder="Çatdırılma vaxtı"
              value={form.deliveryTime}
              onChange={handleChange}
            />

            {/* Ödəniş radio */}
            <div style={{ marginTop: "15px" }}>
              <label style={{ fontWeight: "bold" }}>Ödəniş üsulu:</label>

              <div style={{ marginTop: "8px" }}>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Kartla ödəniş"
                    checked={form.paymentMethod === "Kartla ödəniş"}
                    onChange={handleChange}
                  />
                  Kartla ödəniş
                </label>

                <label style={{ marginLeft: "15px" }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Nağd ödəniş"
                    checked={form.paymentMethod === "Nağd ödəniş"}
                    onChange={handleChange}
                  />
                  Nağd ödəniş
                </label>
              </div>
            </div>

            <textarea
              name="message"
              placeholder="Qeyd"
              value={form.message}
              onChange={handleChange}
              rows="3"
            />

            {/* Whatsapp düyməsi */}
            <button
              onClick={handleOrder}
              style={{
                marginTop: "20px",
                padding: "15px 20px",
                background: "green",
                color: "white",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              📱 İndi Sifariş Ver (WhatsApp)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasketPage;
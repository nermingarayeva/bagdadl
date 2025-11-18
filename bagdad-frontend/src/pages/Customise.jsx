import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Customise = () => {
  const location = useLocation();
  const { name, phone } = location.state || {};

  const [surname, setSurname] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("Morning");
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [message, setMessage] = useState("");
  const [packaging, setPackaging] = useState("wooden");
  const [dateVariety, setDateVariety] = useState("assorted");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!surname || !address) {
      alert("Please enter your surname and address.");
      return;
    }

    // Backend-ə göndəriləcək məlumat
    const orderData = {
      name: `${name} ${surname}`,
      phone,
      address,
      deliveryTime,
      paymentMethod,
      message,
      packaging,
      dateVariety,
    };

    try {
      // 🔥 1. Sifarişi backend-ə göndər
      await axios.post("http://localhost:5000/api/orders", orderData);

      // 🔥 2. WhatsApp mesajı
      const orderMessage = `🛍️ New Gift Order

👤 Name: ${orderData.name}
📞 Phone: ${phone}
🏠 Address: ${address}
🕓 Delivery Time: ${deliveryTime}
💳 Payment Method: ${paymentMethod}
💌 Message: ${message}
🎁 Packaging: ${packaging}
🌴 Date Variety: ${dateVariety}`;

      const adminNumber = "994993469313";
      const whatsappLink = `https://wa.me/${adminNumber}?text=${encodeURIComponent(
        orderMessage
      )}`;

      // WhatsApp aç
      window.open(whatsappLink, "_blank");

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Order error:", err);
      alert("Order could not be sent!");
    }
  };

  return (
    <div className="customise-page">
      <h1>Customise Your Gift</h1>
      <p>User: {name} | Phone: {phone}</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Surname:</label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Delivery Time:</label>
          <select
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
          >
            <option value="Morning">Morning (09:00-12:00)</option>
            <option value="Afternoon">Afternoon (12:00-17:00)</option>
            <option value="Evening">Evening (17:00-21:00)</option>
          </select>
        </div>

        <div>
          <label>Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="Card">Card</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

        <div>
          <label>Add Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
          />
        </div>

        <div>
          <label>Packaging:</label>
          <select
            value={packaging}
            onChange={(e) => setPackaging(e.target.value)}
          >
            <option value="wooden">Yellow Packaging</option>
            <option value="carton">Blue Packaging</option>
          </select>
        </div>

        <div>
          <label>Date Variety:</label>
          <select
            value={dateVariety}
            onChange={(e) => setDateVariety(e.target.value)}
          >
            <option value="assorted">Assorted Dates</option>
            <option value="medjool">Medjool Dates</option>
            <option value="sukari">Sukari Dates</option>
          </select>
        </div>

        <button type="submit">Create Gift & Send Order</button>
      </form>
    </div>
  );
};

export default Customise;

import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("Admin token tapılmadı. Zəhmət olmasa login olun.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`, // ⚡ token önünə "Bearer " əlavə etmək vacibdir
        },
      });

      setOrders(res.data);
    } catch (err) {
      console.error("Order fetch error:", err.response || err);
      if (err.response && err.response.status === 403) {
        alert("Token etibarsız və ya vaxtı bitib!");
      } else if (err.response && err.response.status === 401) {
        alert("Token göndərilməyib və ya tapılmayıb!");
      } else {
        alert("Sifarişləri çəkmək mümkün olmadı!");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Yüklənir...</p>;

  return (
    <div className="admin-orders">
      <h1>Sifarişlər</h1>
      {orders.length === 0 ? (
        <p>Hələ sifariş yoxdur.</p>
      ) : (
        orders.map((o) => (
          <div key={o._id} className="order-card">
            <h3>{o.name}</h3>
            <p><b>Telefon:</b> {o.phone}</p>
            <p><b>Ünvan:</b> {o.address}</p>
            <p><b>Çatdırılma vaxtı:</b> {o.deliveryTime}</p>
            <p><b>Ödəniş:</b> {o.paymentMethod}</p>
            <p><b>Mesaj:</b> {o.message || "Yoxdur"}</p>
            <p><b>Qablaşdırma:</b> {o.packaging}</p>
            <p><b>Xurma növü:</b> {o.dateVariety}</p>
            <small>{new Date(o.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;

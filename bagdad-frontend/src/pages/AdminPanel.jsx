import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminProducts from "./AdminProducts";
import AdminBlogs from "./AdminBlogs";
import AdminOrders from "./AdminOrders";
import AdminComments from "./AdminComments";
import "../assets/images/styles/global.css";
import AdminCampaigns from "./AdminCampaigns";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("products");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Token-i sil
    localStorage.removeItem("adminToken");
    
    // Login səhifəsinə yönləndir
    navigate("/admin/login");
  };

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <h2 className="admin-logo">Admin Panel</h2>

        <button 
          className={activeTab === "products" ? "active" : ""} 
          onClick={() => setActiveTab("products")}
        >
          🛒 Products
        </button>

        <button 
          className={activeTab === "blogs" ? "active" : ""} 
          onClick={() => setActiveTab("blogs")}
        >
          📰 Blogs
        </button>

        <button 
          className={activeTab === "orders" ? "active" : ""} 
          onClick={() => setActiveTab("orders")}
        >
          📦 Orders
        </button>

        <button 
          className={activeTab === "comments" ? "active" : ""} 
          onClick={() => setActiveTab("comments")}
        >
          💬 Comments
        </button>
        <button 
          className={activeTab === "campaigns" ? "active" : ""} 
          onClick={() => setActiveTab("campaigns")}
        >
          💬 Campaigns
        </button>
        {/* ✅ LOGOUT DÜYMƏSI */}
        <button 
          className="logout-btn" 
          onClick={handleLogout}
        >
          🚪 Çıxış
        </button>
      </aside>

      {/* CONTENT */}
      <main className="admin-content">
        {activeTab === "products" && <AdminProducts />}
        {activeTab === "blogs" && <AdminBlogs />}
        {activeTab === "orders" && <AdminOrders />}
        {activeTab === "comments" && <AdminComments />}
        {activeTab === "campaigns" && <AdminCampaigns />}

      </main>
    </div>
  );
};

export default AdminPanel;
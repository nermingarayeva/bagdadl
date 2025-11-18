import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/images/styles/global.css";

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Faydalı");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Kateqoriya seçimləri
  const categoryOptions = [
    "Faydalı",
    "Yeniliklər",
    "Reseptlər",
    "Sağlamlıq",
    "Məhsul Təqdimatı",
    "Kampaniyalar",
    "Digər"
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/news");
      console.log("✅ Yüklənən bloqlar:", response.data);
      setBlogs(response.data.data || response.data || []);
    } catch (error) {
      console.error("❌ Xəbərləri gətirərkən xəta:", error);
      alert("Xəbərləri yükləmək mümkün olmadı");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Zəhmət olmasa başlıq və məzmun daxil edin.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      console.log("🔑 Token:", token ? "Mövcuddur" : "Yoxdur");

      const blogData = {
        title,
        content,
        category,
        author: "Admin",
      };

      console.log("📤 Göndərilən data:", blogData);

      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};

      if (editingId) {
        // REDAKTƏ
        console.log("🔄 Redaktə edilir:", editingId);
        const response = await axios.put(
          `http://localhost:5000/api/news/${editingId}`,
          blogData,
          config
        );
        console.log("✅ Redaktə cavabı:", response.data);
        alert("Xəbər yeniləndi!");
      } else {
        // YENİ ƏLAVƏ
        console.log("➕ Yeni bloq əlavə edilir");
        const response = await axios.post(
          "http://localhost:5000/api/news",
          blogData,
          config
        );
        console.log("✅ Əlavə cavabı:", response.data);
        alert("Xəbər uğurla əlavə edildi!");
      }

      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error("❌ Tam xəta:", error);
      console.error("❌ Response:", error.response?.data);
      console.error("❌ Status:", error.response?.status);
      
      let errorMsg = "Əməliyyat zamanı xəta baş verdi. ";
      
      if (error.response?.status === 401) {
        errorMsg = "Token yoxdur və ya yanlışdır. Admin login olun!";
      } else if (error.response?.status === 400) {
        errorMsg = error.response.data.message || "Məlumatlar düzgün deyil";
      } else if (error.response?.status === 404) {
        errorMsg = "API route tapılmadı. Backend işləyir?";
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    console.log("✏️ Redaktə ediləcək:", blog);
    setEditingId(blog._id);
    setTitle(blog.title);
    setContent(blog.content);
    setCategory(blog.category || "Faydalı");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("Faydalı");
    setEditingId(null);
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Bu xəbəri silmək istədiyinə əminsən?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};

      await axios.delete(`http://localhost:5000/api/news/${id}`, config);

      alert("Xəbər silindi!");
      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (error) {
      console.error("❌ Silinmə zamanı xəta:", error);
      alert(error.response?.data?.message || "Silinmə zamanı xəta baş verdi.");
    }
  };

  return (
    <div className="blogs-page">
      <h1>📰 Admin Blog İdarəetməsi</h1>
      <p>Buradan məhsul faydaları, yeniliklər və digər bloqları idarə edə bilərsiniz.</p>

      {/* FORM */}
      <form className="blog-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Bloqu Redaktə Et" : "Yeni Bloq Əlavə Et"}</h2>

        <input
          type="text"
          placeholder="Bloq başlığı"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />

        <textarea
          placeholder="Bloq məzmununu yazın..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="6"
          disabled={loading}
        />

        <div style={{ marginBottom: "15px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "8px", 
            fontWeight: "bold",
            color: "#333"
          }}>
            📂 Kateqoriya seçin:
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "1rem",
              cursor: "pointer"
            }}
          >
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{
              background: loading ? "#ccc" : (editingId ? "#2196F3" : "#4CAF50"),
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "⏳ Yüklənir..." : (editingId ? "🔄 Yenilə" : "➕ Əlavə et")}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              style={{
                background: "#f44336",
                color: "white",
                padding: "12px 30px",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              ❌ Ləğv et
            </button>
          )}
        </div>
      </form>

      {/* BLOQ SİYAHISI */}
      <div className="blog-list">
        {blogs.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999", fontSize: "18px", padding: "50px" }}>
            📭 Hələ bloq əlavə edilməyib.
          </p>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="blog-card">
              <span style={{
                background: getCategoryColor(blog.category),
                color: "white",
                padding: "5px 15px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold",
                display: "inline-block",
                marginBottom: "10px"
              }}>
                {blog.category || "Ümumi"}
              </span>

              <h2>{blog.title}</h2>
              <small style={{ color: "#999" }}>
                {new Date(blog.createdAt).toLocaleDateString("az-AZ", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </small>
              <p style={{ marginTop: "15px", lineHeight: "1.6" }}>{blog.content}</p>

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button
                  onClick={() => handleEdit(blog)}
                  style={{
                    background: "#2196F3",
                    color: "white",
                    padding: "8px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    flex: 1
                  }}
                >
                  ✏️ Redaktə
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteBlog(blog._id)}
                  style={{ flex: 1 }}
                >
                  🗑️ Sil
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Kateqoriyaya görə rəng
const getCategoryColor = (category) => {
  const colors = {
    "Faydalı": "#4CAF50",
    "Yeniliklər": "#2196F3",
    "Reseptlər": "#FF9800",
    "Sağlamlıq": "#E91E63",
    "Məhsul Təqdimatı": "#9C27B0",
    "Kampaniyalar": "#F44336",
    "Digər": "#607D8B"
  };
  return colors[category] || "#607D8B";
};

export default AdminBlogs;
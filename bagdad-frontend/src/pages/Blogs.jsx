import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/images/styles/global.css";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Hamısı");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/news");
      setBlogs(response.data.data || []);
      setError(null);
    } catch (error) {
      console.error("Xəbərləri yükləyərkən xəta:", error);
      setError("Xəbərləri yükləmək mümkün olmadı");
    } finally {
      setLoading(false);
    }
  };

  // Kateqoriyalara görə filtr
  const categories = ["Hamısı", ...new Set(blogs.map(b => b.category))];
  const filteredBlogs = selectedCategory === "Hamısı" 
    ? blogs 
    : blogs.filter(b => b.category === selectedCategory);

  if (loading) {
    return (
      <div className="blogs-page">
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h2>⏳ Yüklənir...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blogs-page">
        <div style={{ textAlign: "center", padding: "50px", color: "#f44336" }}>
          <h2>⚠️ {error}</h2>
          <button onClick={fetchBlogs} style={{
            padding: "10px 20px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px"
          }}>
            Yenidən cəhd et
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blogs-page">
      {/* HEADER */}
      <div className="blogs-header">
        <h1>📰 Bloqlar və Xəbərlər</h1>
        <p>Məhsul faydaları, yeniliklər və maraqlı məqalələr</p>
      </div>

      {/* KATEQORİYA FİLTR */}
      <div className="category-filter">
        {categories.map(cat => (
          <button
            key={cat}
            className={selectedCategory === cat ? "active" : ""}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "10px 20px",
              margin: "5px",
              border: "none",
              borderRadius: "20px",
              background: selectedCategory === cat ? "#4CAF50" : "#f0f0f0",
              color: selectedCategory === cat ? "white" : "#333",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* BLOQ SİYAHISI */}
      <div className="blog-list">
        {filteredBlogs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p style={{ fontSize: "18px", color: "#999" }}>
              📭 Bu kateqoriyada hələ bloq yoxdur
            </p>
          </div>
        ) : (
          filteredBlogs.map((blog) => (
            <div key={blog._id} className="blog-card user-blog-card">
              {/* Kateqoriya Badge */}
              <span className="blog-category" style={{
                background: "#4CAF50",
                color: "white",
                padding: "5px 15px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold"
              }}>
                {blog.category || "Ümumi"}
              </span>

              <h2>{blog.title}</h2>

              <div className="blog-meta" style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginBottom: "15px",
                color: "#666",
                fontSize: "14px"
              }}>
                <span>
                  👤 {blog.author || "Admin"}
                </span>
                <span>
                  📅 {new Date(blog.createdAt).toLocaleDateString("az-AZ", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </span>
              </div>

              <p style={{
                lineHeight: "1.6",
                color: "#555",
                marginBottom: "15px"
              }}>
                {blog.content}
              </p>

              {/* Əlavə məlumat varsa */}
              {blog.readTime && (
                <div style={{ color: "#888", fontSize: "14px" }}>
                  ⏱️ Oxuma müddəti: {blog.readTime} dəqiqə
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Blogs;
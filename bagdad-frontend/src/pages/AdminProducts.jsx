import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    benefits: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoadingProducts(true);
    setError(null);
    try {
      console.log("🔄 Məhsullar yüklənir...");
      const res = await axios.get("http://localhost:5000/api/products");
      console.log("✅ Cavab:", res.data);
      console.log("✅ Məhsul sayı:", res.data.length);
      setProducts(res.data);
    } catch (error) {
      console.error("❌ XƏTA:", error);
      console.error("❌ Response:", error.response?.data);
      console.error("❌ Status:", error.response?.status);
      
      let errorMsg = "Məhsulları yükləmək mümkün olmadı. ";
      if (error.code === "ERR_NETWORK") {
        errorMsg += "Backend serverə qoşula bilmir. http://localhost:5000 işləyirmi?";
      } else if (error.response) {
        errorMsg += `Status: ${error.response.status}`;
      } else {
        errorMsg += error.message;
      }
      setError(errorMsg);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || "",
      category: product.category || "",
      stock: product.stock || "",
      benefits: product.benefits ? product.benefits.join(", ") : "",
    });
    setImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "",
      stock: "",
      benefits: "",
    });
    setImage(null);
    const fileInput = document.getElementById("image-input");
    if (fileInput) fileInput.value = "";
  };

  const addProduct = async () => {
    if (!formData.name || !formData.price) {
      alert("Ad və qiymət mütləq daxil edilməlidir!");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Token tapılmadı! Yenidən login olun.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("description", formData.description || "");
      data.append("category", formData.category || "Ümumi");
      data.append("stock", formData.stock || 0);

      if (formData.benefits) {
        const benefitsArray = formData.benefits.split(",").map((b) => b.trim());
        data.append("benefits", JSON.stringify(benefitsArray));
      }

      if (image) {
        data.append("image", image);
      }

      if (editingId) {
        await axios.put(`http://localhost:5000/api/products/${editingId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Məhsul yeniləndi!");
      } else {
        await axios.post("http://localhost:5000/api/products", data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Məhsul əlavə edildi!");
      }

      cancelEdit();
      loadProducts();
    } catch (error) {
      console.error("❌ Xəta:", error);
      alert(error.response?.data?.message || "Xəta baş verdi!");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Silmək istədiyinizə əminsiniz?")) return;

    const token = localStorage.getItem("adminToken");
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadProducts();
      alert("Məhsul silindi!");
    } catch (error) {
      console.error("❌ Məhsul silmək mümkün olmadı:", error);
      alert("Xəta baş verdi!");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "30px" }}>
        Məhsullar ({products.length})
      </h1>

      {/* FORM */}
      <div style={{
        background: "#f5f5f5",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "30px"
      }}>
        <h2>{editingId ? "Məhsulu Redaktə Et" : "Yeni Məhsul Əlavə Et"}</h2>

        <input
          name="name"
          placeholder="Məhsul adı *"
          value={formData.name}
          onChange={handleInputChange}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          name="price"
          placeholder="Qiymət (AZN) *"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <textarea
          name="description"
          placeholder="Təsvir"
          value={formData.description}
          onChange={handleInputChange}
          rows="3"
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          name="category"
          placeholder="Kateqoriya (məs: Çay, Kahve)"
          value={formData.category}
          onChange={handleInputChange}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          name="stock"
          placeholder="Stok sayı"
          type="number"
          value={formData.stock}
          onChange={handleInputChange}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          name="benefits"
          placeholder="Faydalar (vergüllə ayır: Dadlı, Sağlam, Organik)"
          value={formData.benefits}
          onChange={handleInputChange}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          id="image-input"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        {image && (
          <div>
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              style={{ width: "150px", borderRadius: "8px", marginTop: "10px" }}
            />
          </div>
        )}

        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <button onClick={addProduct} disabled={loading} style={{
            padding: "10px 20px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer"
          }}>
            {loading ? "Yüklənir..." : editingId ? "Yenilə" : "Əlavə et"}
          </button>

          {editingId && (
            <button onClick={cancelEdit} style={{
              padding: "10px 20px",
              background: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}>
              Ləğv et
            </button>
          )}
        </div>
      </div>

      {/* XƏTA MESAJI */}
      {error && (
        <div style={{
          background: "#ffebee",
          color: "#c62828",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #ef5350"
        }}>
          <strong>⚠️ Xəta:</strong> {error}
          <button onClick={loadProducts} style={{
            marginLeft: "10px",
            padding: "5px 15px",
            background: "#c62828",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
            Yenidən cəhd et
          </button>
        </div>
      )}

      {/* YÜKLƏNMƏ */}
      {loadingProducts && (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <div style={{ fontSize: "24px" }}>⏳ Yüklənir...</div>
        </div>
      )}

      {/* MƏHSUL SİYAHISI */}
      {!loadingProducts && products.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px"
        }}>
          {products.map((p) => (
            <div key={p._id} style={{
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ marginTop: 0 }}>{p.name}</h3>

              {p.image && (
                <img 
                  src={`http://localhost:5000${p.image}`} 
                  alt={p.name}
                  style={{ 
                    width: "100%", 
                    height: "200px", 
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "10px"
                  }}
                />
              )}

              <p><strong>Qiymət:</strong> {p.price} AZN</p>
              {p.description && <p><strong>Təsvir:</strong> {p.description}</p>}
              {p.category && <p><strong>Kateqoriya:</strong> {p.category}</p>}
              {p.stock !== undefined && <p><strong>Stok:</strong> {p.stock}</p>}
              {p.benefits && p.benefits.length > 0 && (
                <p><strong>Faydalar:</strong> {p.benefits.join(", ")}</p>
              )}

              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <button onClick={() => startEdit(p)} style={{
                  flex: 1,
                  padding: "8px",
                  background: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}>
                  ✏️ Redaktə
                </button>
                <button onClick={() => deleteProduct(p._id)} style={{
                  flex: 1,
                  padding: "8px",
                  background: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}>
                  🗑️ Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BOŞ SİYAHI */}
      {!loadingProducts && !error && products.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "50px",
          fontSize: "18px",
          color: "#999"
        }}>
          📦 Heç bir məhsul yoxdur
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
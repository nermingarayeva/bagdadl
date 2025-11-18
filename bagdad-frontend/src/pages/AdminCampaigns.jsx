import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount: "",
    originalPrice: "",
    discountedPrice: "",
    startDate: "",
    endDate: "",
    code: "",
    category: "Ümumi",
    isActive: true,
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const categoryOptions = ["Məhsul", "Çatdırılma", "Ümumi", "Sezon"];

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/campaigns");
      console.log("✅ Kampaniyalar:", response.data);
      setCampaigns(response.data.data || []);
    } catch (error) {
      console.error("❌ Kampaniyaları yükləmək mümkün olmadı:", error);
      alert("Kampaniyaları yükləmək mümkün olmadı");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.discount) {
      alert("Başlıq, təsvir və endirim mütləqdir!");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (image) {
        data.append("image", image);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/campaigns/${editingId}`,
          data,
          config
        );
        alert("Kampaniya yeniləndi!");
      } else {
        await axios.post("http://localhost:5000/api/campaigns", data, config);
        alert("Kampaniya əlavə edildi!");
      }

      resetForm();
      fetchCampaigns();
    } catch (error) {
      console.error("❌ Xəta:", error);
      alert(error.response?.data?.message || "Xəta baş verdi!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (campaign) => {
    setEditingId(campaign._id);
    setFormData({
      title: campaign.title,
      description: campaign.description,
      discount: campaign.discount,
      originalPrice: campaign.originalPrice || "",
      discountedPrice: campaign.discountedPrice || "",
      startDate: campaign.startDate?.split("T")[0] || "",
      endDate: campaign.endDate?.split("T")[0] || "",
      code: campaign.code || "",
      category: campaign.category || "Ümumi",
      isActive: campaign.isActive !== undefined ? campaign.isActive : true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      discount: "",
      originalPrice: "",
      discountedPrice: "",
      startDate: "",
      endDate: "",
      code: "",
      category: "Ümumi",
      isActive: true,
    });
    setImage(null);
    setEditingId(null);
    const fileInput = document.getElementById("image-input");
    if (fileInput) fileInput.value = "";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Silmək istədiyinizə əminsiniz?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:5000/api/campaigns/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Kampaniya silindi!");
      fetchCampaigns();
    } catch (error) {
      console.error("❌ Silinmə xətası:", error);
      alert("Xəta baş verdi!");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      <h1>🎉 Kampaniyalar İdarəetməsi ({campaigns.length})</h1>

      {/* FORM */}
      <div style={{
        background: "#f5f5f5",
        padding: "25px",
        borderRadius: "12px",
        marginBottom: "30px"
      }}>
        <h2>{editingId ? "Kampaniyanı Redaktə Et" : "Yeni Kampaniya Əlavə Et"}</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <input
              name="title"
              placeholder="Kampaniya adı *"
              value={formData.title}
              onChange={handleInputChange}
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
            />

            <input
              name="discount"
              placeholder="Endirim faizi (%) *"
              type="number"
              min="0"
              max="100"
              value={formData.discount}
              onChange={handleInputChange}
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
            />

            <input
              name="originalPrice"
              placeholder="Əvvəlki qiymət (AZN)"
              type="number"
              step="0.01"
              value={formData.originalPrice}
              onChange={handleInputChange}
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
            />

            <input
              name="discountedPrice"
              placeholder="Endirimlə qiymət (AZN)"
              type="number"
              step="0.01"
              value={formData.discountedPrice}
              onChange={handleInputChange}
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
            />

            <input
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
            />

            <input
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
            />

            <input
              name="code"
              placeholder="Promo kod (məs: YENI50)"
              value={formData.code}
              onChange={handleInputChange}
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <textarea
            name="description"
            placeholder="Kampaniya təsviri *"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            style={{ 
              width: "100%", 
              padding: "12px", 
              marginTop: "15px",
              borderRadius: "8px", 
              border: "1px solid #ddd" 
            }}
          />

          <div style={{ marginTop: "15px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
              <span>Kampaniya aktiv</span>
            </label>
          </div>

          <input
            id="image-input"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ marginTop: "15px", width: "100%" }}
          />

          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              style={{ width: "200px", marginTop: "15px", borderRadius: "8px" }}
            />
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px 30px",
                background: loading ? "#ccc" : (editingId ? "#2196F3" : "#4CAF50"),
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Yüklənir..." : (editingId ? "Yenilə" : "Əlavə et")}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: "12px 30px",
                  background: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Ləğv et
              </button>
            )}
          </div>
        </form>
      </div>

      {/* KAMPANİYA SİYAHISI */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "20px"
      }}>
        {campaigns.map((camp) => (
          <div
            key={camp._id}
            style={{
              background: "white",
              border: "2px solid #ddd",
              borderRadius: "12px",
              padding: "20px",
              position: "relative"
            }}
          >
            {camp.image && (
              <img
                src={`http://localhost:5000${camp.image}`}
                alt={camp.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "15px"
                }}
              />
            )}

            <div style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              background: "#f44336",
              color: "white",
              padding: "8px 15px",
              borderRadius: "20px",
              fontWeight: "bold",
              fontSize: "18px"
            }}>
              -{camp.discount}%
            </div>

            <h3 style={{ marginBottom: "10px" }}>{camp.title}</h3>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "10px" }}>
              {camp.description}
            </p>

            {camp.originalPrice && camp.discountedPrice && (
              <div style={{ marginBottom: "10px" }}>
                <span style={{
                  textDecoration: "line-through",
                  color: "#999",
                  marginRight: "10px"
                }}>
                  {camp.originalPrice} AZN
                </span>
                <span style={{ color: "#4CAF50", fontWeight: "bold", fontSize: "18px" }}>
                  {camp.discountedPrice} AZN
                </span>
              </div>
            )}

            {camp.code && (
              <div style={{
                background: "#ffe0b2",
                padding: "8px",
                borderRadius: "5px",
                marginBottom: "10px",
                textAlign: "center",
                fontWeight: "bold"
              }}>
                Kod: {camp.code}
              </div>
            )}

            <p style={{ fontSize: "12px", color: "#999" }}>
              📅 {new Date(camp.startDate).toLocaleDateString("az-AZ")} - {new Date(camp.endDate).toLocaleDateString("az-AZ")}
            </p>

            <div style={{
              display: "inline-block",
              background: camp.isActive ? "#4CAF50" : "#f44336",
              color: "white",
              padding: "4px 12px",
              borderRadius: "12px",
              fontSize: "12px",
              marginTop: "10px"
            }}>
              {camp.isActive ? "✅ Aktiv" : "❌ Deaktiv"}
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button
                onClick={() => handleEdit(camp)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                ✏️ Redaktə
              </button>
              <button
                onClick={() => handleDelete(camp._id)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                🗑️ Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {campaigns.length === 0 && (
        <p style={{ textAlign: "center", color: "#999", padding: "50px" }}>
           Hələ kampaniya əlavə edilməyib
        </p>
      )}
    </div>
  );
};

export default AdminCampaigns;
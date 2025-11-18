import React, { useState, useEffect } from "react";
import axios from "axios";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, active, upcoming

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/campaigns");
      setCampaigns(response.data.data || []);
    } catch (error) {
      console.error("❌ Kampaniyaları yükləmək mümkün olmadı:", error);
    } finally {
      setLoading(false);
    }
  };
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
  const getFilteredCampaigns = () => {
    const now = new Date();

    switch (filter) {
      case "active":
        return campaigns.filter(
          (c) =>
            c.isActive &&
            new Date(c.startDate) <= now &&
            new Date(c.endDate) >= now
        );
      case "upcoming":
        return campaigns.filter(
          (c) => c.isActive && new Date(c.startDate) > now
        );
      default:
        return campaigns.filter((c) => c.isActive);
    }
  };

  const filteredCampaigns = getFilteredCampaigns();

  const getRemainingDays = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2>⏳ Yüklənir...</h2>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #151A3A 30%, #292B68 70%)",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "50px", color: "white" }}>
          <h1 style={{ fontSize: "3rem", marginBottom: "10px" }}>
             Endirim və Kampaniyalar
          </h1>
          <p style={{ fontSize: "1.2rem", opacity: 0.9 }}>
            Ən yaxşı təklifləri qaçırmayın!
          </p>
        </div>

        {/* FİLTRLƏR */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "40px"
        }}>
          {["all", "active", "upcoming"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "12px 30px",
                border: "2px solid white",
                borderRadius: "25px",
                background: filter === f ? "white" : "transparent",
                color: filter === f ? "#667eea" : "white",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s",
                fontSize: "16px"
              }}
            >
              {f === "all" && " Hamısı"}
              {f === "active" && " Aktiv"}
              {f === "upcoming" && " Gələcək"}
            </button>
          ))}
        </div>

        {/* KAMPANİYALAR */}
        {filteredCampaigns.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "80px 20px",
            background: "white",
            borderRadius: "20px"
          }}>
            <h2 style={{ color: "#666" }}>📭 Hazırda kampaniya yoxdur</h2>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "30px"
          }}>
            {filteredCampaigns.map((campaign) => {
              const remainingDays = getRemainingDays(campaign.endDate);
              const isActive =
                new Date(campaign.startDate) <= new Date() &&
                new Date(campaign.endDate) >= new Date();

              return (
                <div
                  key={campaign._id}
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    cursor: "pointer",
                    position: "relative"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
                  }}
                >
                  {/* ŞƏKİL */}
                  {campaign.image && (
                    <div style={{ position: "relative", height: "250px" }}>
                      <img
                        src={`http://localhost:5000${campaign.image}`}
                        alt={campaign.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />

                      {/* ENDİRİM BADGE */}
                      <div style={{
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        background: "#ff4757",
                        color: "white",
                        padding: "15px 20px",
                        borderRadius: "50%",
                        fontWeight: "bold",
                        fontSize: "24px",
                        boxShadow: "0 5px 15px rgba(255,71,87,0.5)"
                      }}>
                        -{campaign.discount}%
                      </div>

                      {/* STATUS BADGE */}
                      {isActive && (
                        <div style={{
                          position: "absolute",
                          bottom: "15px",
                          left: "15px",
                          background: "#2ecc71",
                          color: "white",
                          padding: "8px 15px",
                          borderRadius: "20px",
                          fontSize: "14px",
                          fontWeight: "bold"
                        }}>
                          AKTİV
                        </div>
                      )}
                    </div>
                  )}

                  {/* MƏZMUN */}
                  <div style={{ padding: "25px" }}>
                    <h2 style={{
                      fontSize: "1.8rem",
                      marginBottom: "15px",
                      color: "#2c3e50"
                    }}>
                      {campaign.title}
                    </h2>

                    <p style={{
                      color: "#7f8c8d",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                      marginBottom: "20px"
                    }}>
                      {campaign.description}
                    </p>

                    {/* QİYMƏT */}
                    {campaign.originalPrice && campaign.discountedPrice && (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        marginBottom: "20px"
                      }}>
                        <span style={{
                          textDecoration: "line-through",
                          color: "#95a5a6",
                          fontSize: "1.2rem"
                        }}>
                          {campaign.originalPrice} AZN
                        </span>
                        <span style={{
                          color: "#2ecc71",
                          fontWeight: "bold",
                          fontSize: "2rem"
                        }}>
                          {campaign.discountedPrice} AZN
                        </span>
                      </div>
                    )}

                    {/* PROMO KOD */}
                    {/* {campaign.code && (
                      <div style={{
                        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                        color: "white",
                        padding: "15px",
                        borderRadius: "12px",
                        textAlign: "center",
                        marginBottom: "20px",
                        fontWeight: "bold",
                        fontSize: "18px",
                        letterSpacing: "2px"
                      }}>
                        🎫 KOD: {campaign.code}
                      </div>
                    )} */}

                    {/* TARİXLƏR */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "15px",
                      background: "#ecf0f1",
                      borderRadius: "10px",
                      marginBottom: "15px"
                    }}>
                      <div>
                        <p style={{ fontSize: "12px", color: "#7f8c8d", marginBottom: "5px" }}>
                          Başlanğıc
                        </p>
                        <p style={{ fontWeight: "bold", color: "#2c3e50" }}>
                          {new Date(campaign.startDate).toLocaleDateString("az-AZ")}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "12px", color: "#7f8c8d", marginBottom: "5px" }}>
                          Bitmə
                        </p>
                        <p style={{ fontWeight: "bold", color: "#e74c3c" }}>
                          {new Date(campaign.endDate).toLocaleDateString("az-AZ")}
                        </p>
                      </div>
                    </div>

                    {/* QALAN GÜN */}
                    {isActive && remainingDays > 0 && (
                      <div style={{
                        background: remainingDays <= 3 ? "#ff4757" : "#ffa502",
                        color: "white",
                        padding: "12px",
                        borderRadius: "8px",
                        textAlign: "center",
                        fontWeight: "bold",
                        animation: remainingDays <= 3 ? "pulse 1.5s infinite" : "none"
                      }}>
                         {remainingDays} gün qalıb!
                      </div>
                    )}

                    {/* KATEQORİYA */}
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
              );
            })}
          </div>
        )}
      </div>

      {/* CSS ANİMASİYA */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.98); }
        }
      `}</style>
    </div>
  );
};

export default Campaigns;
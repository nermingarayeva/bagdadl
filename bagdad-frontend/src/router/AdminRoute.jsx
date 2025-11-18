import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const AdminRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = yoxlanılır
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const verifyToken = async () => {
      // Token yoxdursa
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Backend-ə token göndərib yoxla
        const response = await axios.get('http://localhost:5000/api/admin/verify', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Token etibarlıdırsa
        if (response.data.valid) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("adminToken"); // Etibarsız token-i sil
        }
      } catch (error) {
        console.error("Token doğrulama xətası:", error);
        setIsAuthenticated(false);
        localStorage.removeItem("adminToken"); // Xətalı token-i sil
      }
    };

    verifyToken();
  }, [token]);

  // Yoxlanılır
  if (isAuthenticated === null) {
    return <div>Yüklənir...</div>;
  }

  // Token etibarsızdırsa login-ə yönləndir
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Token etibarlıdırsa admin panel-ə icazə ver
  return children;
};

export default AdminRoute;
const jwt = require("jsonwebtoken");

const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "Authorization token is missing" });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token)
    return res.status(401).json({ message: "Token tapılmadı" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // token məlumatlarını req.admin-də saxlayırıq
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(403).json({ message: "Token etibarsız və ya vaxtı bitib", error: err.message });
  }
};

module.exports = verifyAdminToken;

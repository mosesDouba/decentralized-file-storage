const jwt = require("jsonwebtoken");
const JWT_SECRET = "douba_super_secret_jwt_key_2024"; // 👈 Same secret as in auth.routes.js

// ✅ JWT Verification
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: "Token not provided" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user; // 👈 Add user data to req
    next();
  });
}

// ✅ Admin only
function isAdmin(req, res, next) {
  if (req.user?.role !== "admin")
    return res.status(403).json({ error: "Insufficient privileges (Admin only)" });
  next();
}

// ✅ Only for owner or Admin
function isOwnerOrAdmin(resourceOwnerId) {
  return (req, res, next) => {
    if (req.user.role === "admin" || req.user.id === resourceOwnerId) {
      return next();
    }
    return res.status(403).json({ error: "Access not authorized" });
  };
}

module.exports = {
  verifyToken,
  isAdmin,
  isOwnerOrAdmin,
};

const jwt = require("jsonwebtoken");

exports.requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ ok: false, error: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // {id, role}
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: "Invalid token" });
  }
};

exports.requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user?.role) return res.status(401).json({ ok: false, error: "Unauthorized" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ ok: false, error: "Forbidden" });
    }
    next();
  };
};

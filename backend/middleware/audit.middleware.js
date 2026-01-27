const pool = require("../config/db");

exports.audit = (action, entity_type = null) => {
  return async (req, res, next) => {
    try {
      // run route first, then log (so you log only if no crash)
      res.on("finish", async () => {
        try {
          const userId = req.user?.id || null;
          const entityId = res.locals.entity_id || null;

          await pool.query(
            "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address) VALUES ($1, $2, $3, $4, $5)",
            [userId, action, entity_type, entityId, req.ip]
          );
        } catch (e) {
          console.error("AUDIT LOG ERROR:", e.message);
        }
      });

      next();
    } catch (err) {
      next();
    }
  };
};

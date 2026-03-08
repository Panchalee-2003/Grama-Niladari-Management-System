const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ── Multer (notice images) ─────────────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, "..", "uploads", "notices");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
        const u = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        cb(null, `${u}${path.extname(file.originalname)}`);
    },
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (/jpeg|jpg|png|gif|webp/.test(path.extname(file.originalname).toLowerCase()))
            cb(null, true);
        else cb(new Error("Only image files are allowed"));
    },
});

// ─────────────────────────────────────────
// GN: Post a notice
// ─────────────────────────────────────────
router.post(
    "/",
    requireAuth,
    requireRole("GN"),
    (req, res, next) => upload.single("image")(req, res, (err) => {
        if (err) return res.status(400).json({ ok: false, error: err.message });
        next();
    }),
    async (req, res) => {
        try {
            const gnUserId = req.user.id;
            const { title, description, notice_date } = req.body;

            if (!title?.trim())
                return res.status(400).json({ ok: false, error: "Title is required" });

            const gnRow = await pool.query(
                "SELECT gn_id FROM grama_niladhari WHERE user_id=$1 LIMIT 1",
                [gnUserId]
            );
            if (!gnRow.rows.length)
                return res.status(400).json({ ok: false, error: "GN profile not found" });

            const gnId = gnRow.rows[0].gn_id;
            const imagePath = req.file ? `notices/${req.file.filename}` : null;

            const result = await pool.query(
                `INSERT INTO notice (gn_id, title, description, notice_date, image_path, created_at)
         VALUES ($1,$2,$3,$4,$5,NOW())
         RETURNING notice_id, title, description, notice_date, image_path, created_at`,
                [gnId, title.trim(), description?.trim() || null, notice_date || null, imagePath]
            );

            return res.status(201).json({ ok: true, notice: result.rows[0] });
        } catch (err) {
            if (req.file) fs.unlink(req.file.path, () => { });
            console.error("Post Notice Error:", err);
            return res.status(500).json({ ok: false, error: err.message });
        }
    }
);

// ─────────────────────────────────────────
// PUBLIC / CITIZEN: Get all notices
// ─────────────────────────────────────────
router.get("/", requireAuth, async (_req, res) => {
    try {
        const result = await pool.query(
            `SELECT n.notice_id, n.title, n.description, n.notice_date, n.image_path, n.created_at,
              g.name AS gn_name
       FROM notice n
       LEFT JOIN grama_niladhari g ON g.gn_id = n.gn_id
       ORDER BY n.created_at DESC`
        );
        return res.json({ ok: true, notices: result.rows });
    } catch (err) {
        console.error("Get Notices Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// ─────────────────────────────────────────
// GN: Delete a notice
// ─────────────────────────────────────────
router.delete("/:id", requireAuth, requireRole("GN"), async (req, res) => {
    try {
        const { id } = req.params;

        // Get image path before deletion so we can remove the file
        const existing = await pool.query(
            "SELECT image_path FROM notice WHERE notice_id=$1", [id]
        );

        await pool.query("DELETE FROM notice WHERE notice_id=$1", [id]);

        // Remove image file if any
        if (existing.rows[0]?.image_path) {
            const fullPath = path.join(__dirname, "..", "uploads", existing.rows[0].image_path);
            fs.unlink(fullPath, () => { });
        }

        return res.json({ ok: true });
    } catch (err) {
        console.error("Delete Notice Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

module.exports = router;

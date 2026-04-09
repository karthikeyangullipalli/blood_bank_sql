const express = require("express");
const router = express.Router();
const donorController = require("../controllers/donorController");
const db = require("../config/db");

// --- Donors ---
router.get("/", donorController.getDonors);
router.post("/", donorController.addDonor);
router.delete("/:id", donorController.deleteDonor);

// --- Blood groups (for dropdown) ---
router.get("/blood", (req, res) => {
  db.query("SELECT * FROM blood", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// --- Stats ---
router.get("/stats", (req, res) => {
  db.query("SELECT COUNT(*) as donors FROM donor_details", (e1, r1) => {
    if (e1) return res.status(500).json({ error: e1.message });
    db.query("SELECT COUNT(*) as queries FROM contact_query", (e2, r2) => {
      if (e2) return res.status(500).json({ error: e2.message });
      res.json({
        donors: r1[0].donors,
        queries: r2[0].queries,
      });
    });
  });
});

// --- Contact / Queries ---
router.post("/contact", (req, res) => {
  const { name, email, phone, message } = req.body;
  db.query(
    "INSERT INTO contact_query (query_name, query_mail, query_number, query_message) VALUES (?, ?, ?, ?)",
    [name, email, phone, message],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Query submitted" });
    }
  );
});

// Update query status (must be defined before GET /queries to avoid conflicts)
router.patch("/queries/:id/status", (req, res) => {
  console.log("PATCH /queries/:id/status hit with id:", req.params.id, "body:", req.body);
  const { status } = req.body;
  db.query(
    "UPDATE contact_query SET query_status = ? WHERE query_id = ?",
    [status, req.params.id],
    (err) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: err.message });
      }
      console.log("Status updated successfully for query:", req.params.id);
      res.json({ message: "Status updated" });
    }
  );
});

router.get("/queries", (req, res) => {
  db.query("SELECT * FROM contact_query ORDER BY created_at DESC", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// --- Login ---
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM admin_info WHERE admin_username=? AND admin_password=?",
    [username, password],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: result.length > 0 });
    }
  );
});

// --- Pages ---
router.get("/pages", (req, res) => {
  db.query("SELECT * FROM pages", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

module.exports = router;

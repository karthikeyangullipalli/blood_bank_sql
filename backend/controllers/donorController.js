const db = require("../config/db");

// GET all donors (with optional ?blood= filter)
exports.getDonors = (req, res) => {
  const blood = req.query.blood;

  let sql = `
    SELECT d.*, b.blood_group 
    FROM donor_details d
    JOIN blood b ON d.blood_id = b.blood_id
  `;

  db.query(sql + (blood ? " WHERE d.blood_id = ?" : ""), blood ? [blood] : [], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// POST add donor
exports.addDonor = (req, res) => {
  const { name, phone, age, gender, blood_id, address } = req.body;
  const sql = `
    INSERT INTO donor_details 
    (donor_name, donor_number, donor_age, donor_gender, blood_id, donor_address)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [name, phone, age, gender, blood_id, address], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Donor added successfully" });
  });
};

// DELETE donor
// FIX: donation_log has a FK → donor_details (donor_id).
// MySQL blocks deleting a donor while donation_log still references it.
// Solution: delete from donation_log FIRST, then delete the donor.
exports.deleteDonor = (req, res) => {
  const id = req.params.id;

  // Step 1: remove the log entry for this donor
  db.query("DELETE FROM donation_log WHERE donor_id = ?", [id], (err1) => {
    if (err1) return res.status(500).json({ error: "Failed to remove donation log: " + err1.message });

    // Step 2: now safe to delete the donor
    db.query("DELETE FROM donor_details WHERE donor_id = ?", [id], (err2) => {
      if (err2) return res.status(500).json({ error: "Failed to delete donor: " + err2.message });
      res.json({ message: "Donor deleted successfully" });
    });
  });
};

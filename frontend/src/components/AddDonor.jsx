import { useState, useEffect } from "react";
import API from "../api";

function AddDonor({ onAdd }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", age: "", gender: "", blood_id: "", address: ""
  });
  const [bloods, setBloods] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get("/donors/blood").then(res => setBloods(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/donors", form);
      alert("Donor added successfully!");
      setForm({ name: "", email: "", phone: "", age: "", gender: "", blood_id: "", address: "" });
      onAdd();
    } catch (err) {
      console.error("Error adding donor:", err);
      alert("Failed to add donor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.headerDot} />
        <h2 style={styles.title}>Add Donor</h2>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Full Name</label>
        <input
          style={styles.input}
          name="name"
          placeholder="e.g. Karthikeyan"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label style={styles.label}>Phone Number</label>
        <input
          style={styles.input}
          name="phone"
          type="tel"
          placeholder="10-digit number"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          name="email"
          type="email"
          placeholder="example@gmail.com"
          value={form.email}
          onChange={handleChange}
          required
        />

        <div style={styles.row}>
          <div style={styles.halfField}>
            <label style={styles.label}>Age</label>
            <input
              style={styles.input}
              name="age"
              type="number"
              placeholder="18+"
              min="17"
              value={form.age}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.halfField}>
            <label style={styles.label}>Gender</label>
            <select
              style={styles.input}
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <label style={styles.label}>Blood Group</label>
        <select
          style={styles.input}
          name="blood_id"
          value={form.blood_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Blood Group</option>
          {bloods.map(b => (
            <option key={b.blood_id} value={b.blood_id}>
              {b.blood_group}
            </option>
          ))}
        </select>

        <label style={styles.label}>Address</label>
        <input
          style={styles.input}
          name="address"
          placeholder="Full address"
          value={form.address}
          onChange={handleChange}
          required
        />

        <button style={{ ...styles.button, opacity: loading ? 0.7 : 1 }} disabled={loading}>
          {loading ? "Adding..." : "Add Donor"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: "24px",
    borderRadius: "14px",
    width: "300px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #f1f5f9",
    flexShrink: 0,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  headerDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#ef4444",
  },
  title: {
    margin: 0,
    fontSize: "17px",
    fontWeight: "700",
    color: "#0f172a",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    marginTop: "8px",
  },
  input: {
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    color: "#0f172a",
    background: "#f8fafc",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  row: {
    display: "flex",
    gap: "10px",
  },
  halfField: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  button: {
    marginTop: "14px",
    background: "#ef4444",
    color: "white",
    padding: "11px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    letterSpacing: "0.3px",
  },
};

export default AddDonor;

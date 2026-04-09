import { useEffect, useState } from "react";
import API from "../api";
function DonorList({ refresh }) {
  const [donors, setDonors] = useState([]);
  const [bloods, setBloods] = useState([]);
  const [filter, setFilter] = useState("");
  useEffect(() => {
    API.get("/donors/blood").then(res => setBloods(res.data));
  }, []);

  useEffect(() => {
    const url = filter ? `/donors?blood=${filter}` : "/donors";
    API.get(url)
      .then(res => setDonors(res.data))
      .catch(err => console.log(err));
  }, [refresh, filter]);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this donor?")) return;
    API.delete(`/donors/${id}`)
      .then(() => setDonors(prev => prev.filter(d => d.donor_id !== id)))
      .catch(err => console.log(err));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Donor List</h2>
        <select
          style={styles.select}
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="">All Blood Groups</option>
          {bloods.map(b => (
            <option key={b.blood_id} value={b.blood_id}>
              {b.blood_group}
            </option>
          ))}
        </select>
      </div>

      {donors.length === 0 ? (
        <div style={styles.empty}>
          <p style={{ margin: 0, color: "#94a3b8" }}>No donors found</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {donors.map(d => (
            <div key={d.donor_id} style={styles.card}>
              <div style={styles.cardTop}>
                <div style={styles.avatar}>
                  {d.donor_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={styles.name}>{d.donor_name}</h3>
                  <p style={styles.phone}>{d.donor_number}</p>
                </div>
                <div style={styles.bloodBadge}>{d.blood_group}</div>
              </div>
              <p style={styles.address}>📍 {d.donor_address}</p>
              <button
                onClick={() => handleDelete(d.donor_id)}
                style={styles.deleteBtn}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    background: "white",
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #f1f5f9",
    minWidth: "320px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    margin: 0,
    fontSize: "17px",
    fontWeight: "700",
    color: "#0f172a",
  },
  select: {
    padding: "7px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "13px",
    background: "#f8fafc",
    color: "#0f172a",
    cursor: "pointer",
  },
  empty: {
    padding: "40px",
    textAlign: "center",
    background: "#f8fafc",
    borderRadius: "10px",
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  card: {
    border: "1px solid #f1f5f9",
    borderRadius: "10px",
    padding: "14px 16px",
    background: "#fafafa",
    transition: "box-shadow 0.2s",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px",
  },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#fef2f2",
    color: "#ef4444",
    fontWeight: "700",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  name: {
    margin: "0 0 2px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#0f172a",
  },
  phone: {
    margin: 0,
    fontSize: "13px",
    color: "#64748b",
  },
  bloodBadge: {
    marginLeft: "auto",
    background: "#fef2f2",
    color: "#ef4444",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    padding: "3px 10px",
    fontSize: "13px",
    fontWeight: "700",
    flexShrink: 0,
  },
  address: {
    margin: "0 0 10px",
    fontSize: "13px",
    color: "#64748b",
  },
  deleteBtn: {
    background: "none",
    border: "1px solid #fecaca",
    color: "#ef4444",
    padding: "5px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
  },
};

export default DonorList;

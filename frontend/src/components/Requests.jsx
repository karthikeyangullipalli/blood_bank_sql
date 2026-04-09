import { useEffect, useState, useMemo } from "react";
import API from "../api";

function Requests({ onQuerySubmit }) {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");
  const [search,setSearch]= useState("");
  
  const ENDPOINTS = useMemo(() => ({
    GET_QUERIES:"/donors/queries",
    SUBMIT:"/donors/contact",
  }), []);

  const fetchQueries = () => {
    setLoading(true);
    API.get(ENDPOINTS.GET_QUERIES)
 .then(res => {
        setQueries(
          res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        );
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let mounted=true;
    API.get(ENDPOINTS.GET_QUERIES)
    .then(res => {
      if(mounted){
        setQueries(
          res.data.sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
        );
      }
    })
    .catch(err => console.error(err))
    .finally(() => mounted && setLoading(false));
    return ()=> (mounted = false);
  }, [ENDPOINTS]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!/^[0-9]{10}$/.test(form.phone)){
      setSubmitMsg("Enter a Valid 10-digit phone number");
      return;
    }
    setSubmitting(true);
    setSubmitMsg("");

    try {
      await API.post(ENDPOINTS.SUBMIT, form);
setSubmitMsg("✅ Request submitted and saved to database.");
  setForm({ name: "", email: "", phone: "", message: "" });
      fetchQueries();
        setTimeout(() => setView("list"), 1500);
      onQuerySubmit(); // Notify App.jsx to refresh dashboard stats
    } catch (err) {
      setSubmitMsg(`❌ ${err.response?.data?.message || "Server error"}`);
    } finally {
      setSubmitting(false);
    }
  };
  const pendingCount = queries.filter(
    q => (q.query_status || "Pending")=== "Pending").length;
  
    const filteredQueries = queries.filter(q => 
      q.query_name?.toLowerCase().includes(search.toLowerCase())
    );
  const handleMarkDone = async (id) => {
  try {
    console.log(`Marking query ${id} as Read...`);
    const response = await API.patch(`/donors/queries/${id}/status`, { status: "Read" });
    console.log("Update response:", response);
    setQueries(prev =>
      prev.map(q => q.query_id === id ? { ...q, query_status: "Read" } : q)
    );
    setSubmitMsg("✅ Request marked as completed!");
    setTimeout(() => setSubmitMsg(""), 3000);
  } catch (err) {
    console.error("Failed to update status:", err.response?.data || err.message);
    setSubmitMsg(`❌ Failed to update: ${err.response?.data?.error || err.message}`);
    setTimeout(() => setSubmitMsg(""), 3000);
  }
};

  return (
    <div>
      {/* Tab bar */}
      <div style={styles.tabBar}>
        <button
          style={{ ...styles.tab, ...(view === "list" ? styles.tabActive : {}) }}
          onClick={() => setView("list")}
        >
          All Requests
          {pendingCount > 0 && (
            <span style={styles.badge}>{pendingCount} pending</span>
          )}
        </button>
        <button
          style={{ ...styles.tab, ...(view === "new" ? styles.tabActive : {}) }}
          onClick={() => setView("new")}
        >
          + Submit New Request
        </button>
      </div>

      {/* Submit Form — inserts into contact_query table */}
      {view === "list" && (
        <input
        style={styles.input}
        placeholder="Search by Name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        />
      )}
      {/*Form*/}
      {view === "new" && (
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <div style={styles.dot} />
            <div>
              <h3 style={styles.formTitle}>New Blood Request</h3>
              <p style={styles.formSub}>Saved to <code>contact_query</code> table in MySQL</p>
            </div>
          </div>

          {submitMsg && (
            <div style={{
              ...styles.msgBox,
              background: submitMsg.startsWith("✅") ? "#f0fdf4" : "#fef2f2",
              borderColor: submitMsg.startsWith("✅") ? "#bbf7d0" : "#fecaca",
              color: submitMsg.startsWith("✅") ? "#166534" : "#dc2626",
            }}>
              {submitMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input
                  style={styles.input}
                  name="name"
                  placeholder="Patient or requester name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Phone</label>
                <input
                  style={styles.input}
                  name="phone"
                  placeholder="10-digit number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={styles.field}>
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
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Message / Blood Needed</label>
              <textarea
                style={{ ...styles.input, height: "90px", resize: "vertical" }}
                name="message"
                placeholder="e.g. Urgently need 2 units of B+ blood for surgery at NIMS Hospital..."
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <button
              style={{ ...styles.submitBtn, opacity: submitting ? 0.7 : 1 }}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>
      )}

      {/* Queries list — reads from contact_query table */}
      {view === "list" && (
        <div>
          {loading ? (
            <p style={{ color: "#94a3b8", padding: "20px 0" }}>Loading from database...</p>
          ) : queries.length === 0 ? (
            <div style={styles.empty}>
              <p style={{ margin: 0, color: "#94a3b8" }}>No requests in the database yet.</p>
              <button style={styles.emptyBtn} onClick={() => setView("new")}>
                Submit the first one →
              </button>
            </div>
          ) : (
            <div style={styles.list}>
              {filteredQueries.map(q => (
                <div key={q.query_id} style={styles.queryCard}>
                  <div style={styles.cardTop}>
                    <div style={styles.avatar}>
                      {q.query_name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={styles.queryName}>{q.query_name}</h3>
                      <p style={styles.querySub}>{q.query_number} · {q.query_mail}</p>
                    </div>
                    {/* Replace the existing statusBadge div with this */}
<div style={{
  ...styles.statusBadge,
  background: q.query_status === "Read" ? "#f0fdf4" : "#fef2f2",
  color: q.query_status === "Read" ? "#16a34a" : "#ef4444",
  borderColor: q.query_status === "Read" ? "#bbf7d0" : "#fecaca",
}}>
  {q.query_status || "Pending"}
</div>
                  </div>
                  <p style={styles.queryMessage}>"{q.query_message}"</p>
                  {q.created_at && (
                    <p style={styles.queryTime}>
                       Submitted: {new Date(q.created_at).toLocaleString("en-IN")}<br/>
                      {/* Add this button below the queryTime <p> tag */}
{(q.query_status || "Pending") === "Pending" && (
  <button
    onClick={() => handleMarkDone(q.query_id)}
    style={styles.doneBtn}
  >
  Mark as Completed
  </button>
)}
                      
                     
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  doneBtn: {
  marginTop: "8px",
  background: "#f0fdf4",
  color: "#15803d",
  border: "1px solid #bbf7d0",
  padding: "5px 14px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
  fontFamily: "inherit",
},
  tabBar: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
  },
  tab: {
    padding: "9px 18px",
    borderRadius: "8px",
    border: "1.5px solid #e2e8f0",
    background: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontFamily: "inherit",
  },
  tabActive: {
    background: "#0f172a",
    color: "white",
    borderColor: "#0f172a",
  },
  badge: {
    background: "#ef4444",
    color: "white",
    fontSize: "11px",
    padding: "2px 8px",
    borderRadius: "20px",
    fontWeight: "600",
  },
  formCard: {
    background: "white",
    borderRadius: "14px",
    padding: "28px",
    border: "1px solid #f1f5f9",
    boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
    maxWidth: "620px",
  },
  formHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "22px",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#ef4444",
    marginTop: "6px",
    flexShrink: 0,
  },
  formTitle: {
    margin: "0 0 4px",
    fontSize: "17px",
    fontWeight: "700",
    color: "#0f172a",
  },
  formSub: {
    margin: 0,
    fontSize: "13px",
    color: "#64748b",
  },
  msgBox: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid",
    fontSize: "14px",
    marginBottom: "16px",
    fontWeight: "500",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  row: {
    display: "flex",
    gap: "12px",
  },
  field: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1.5px solid #e2e8f0",
    fontSize: "14px",
    color: "#0f172a",
    background: "#f8fafc",
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
  },
  submitBtn: {
    background: "#ef4444",
    color: "white",
    padding: "11px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    fontFamily: "inherit",
    marginTop: "4px",
  },
  empty: {
    background: "white",
    borderRadius: "14px",
    padding: "48px",
    textAlign: "center",
    border: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    alignItems: "center",
  },
  emptyBtn: {
    background: "none",
    border: "1.5px solid #0f172a",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    fontFamily: "inherit",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "700px",
  },
  queryCard: {
    background: "white",
    borderRadius: "12px",
    padding: "18px 20px",
    border: "1px solid #f1f5f9",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "10px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#fef2f2",
    color: "#ef4444",
    fontWeight: "700",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  queryName: {
    margin: "0 0 2px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#0f172a",
  },
  querySub: {
    margin: 0,
    fontSize: "12px",
    color: "#64748b",
  },
  statusBadge: {
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    border: "1px solid",
    flexShrink: 0,
  },
  queryMessage: {
    margin: "0 0 8px",
    fontSize: "14px",
    color: "#475569",
    fontStyle: "italic",
    lineHeight: "1.5",
  },
  queryTime: {
    margin: 0,
    fontSize: "12px",
    color: "#94a3b8",
  },
};

export default Requests;
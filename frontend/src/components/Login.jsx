import { useState } from "react";
import API from "../api";

function Login({ onLogin }) {
  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!data.username || !data.password) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/donors/login", data);
      if (res.data.success) {
        onLogin(); // ← tells App.jsx to show the dashboard
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      setError("Could not connect to server. Is the backend running?", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Brand */}
        <div style={styles.brand}>
          <div style={styles.dot} />
          <span style={styles.brandText}>Blood Bank</span>
        </div>

        <h2 style={styles.heading}>Admin Login</h2>
        <p style={styles.sub}>Sign in to manage donors and requests</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.field}>
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            placeholder="Enter Username"
            value={data.username}
            onChange={e => setData({ ...data, username: e.target.value })}
            onKeyDown={handleKey}
            autoFocus
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={data.password}
            onChange={e => setData({ ...data, password: e.target.value })}
            onKeyDown={handleKey}
          />
        </div>

        <button
          style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p style={styles.hint}>
          Credentials are stored in the <code>admin_info</code> table in MySQL.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "40px",
    width: "360px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "28px",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#ef4444",
    boxShadow: "0 0 8px #ef4444",
  },
  brandText: {
    fontWeight: "700",
    fontSize: "15px",
    color: "#0f172a",
    letterSpacing: "-0.3px",
  },
  heading: {
    margin: "0 0 6px",
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "-0.5px",
  },
  sub: {
    margin: "0 0 24px",
    fontSize: "14px",
    color: "#64748b",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    marginBottom: "16px",
  },
  field: {
    marginBottom: "14px",
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
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1.5px solid #e2e8f0",
    fontSize: "15px",
    color: "#0f172a",
    outline: "none",
    background: "#f8fafc",
    transition: "border-color 0.15s",
  },
  btn: {
    width: "100%",
    marginTop: "8px",
    background: "#ef4444",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    letterSpacing: "0.3px",
  },
  hint: {
    marginTop: "16px",
    fontSize: "12px",
    color: "#94a3b8",
    textAlign: "center",
  },
};

export default Login;

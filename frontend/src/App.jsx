import AddDonor from "./components/AddDonor";
import DonorList from "./components/DonorList";
import Requests from "./components/requests";
import Pages from "./components/Pages";
import Login from "./components/Login";
import { useState, useEffect } from "react";
import API from "./api";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [refresh, setRefresh] = useState(false);
  const [stats, setStats] = useState({ donors: 0, queries: 0 });
  const [page, setPage] = useState(() => {
    return localStorage.getItem("page") || "dashboard";
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn ? "true" : "false");
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("page", page);
  }, [page]);

  useEffect(() => {
    if (isLoggedIn) {
      API.get("/donors/stats").then(res => setStats(res.data));
    }
  }, [refresh, isLoggedIn]);

  // ─── Login Gate ────────────────────────────────────
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  // ─── Main Dashboard ────────────────────────────────
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "▦" },
    { id: "donors",    label: "Donors",    icon: "♥" },
    { id: "requests",  label: "Requests",  icon: "✉" },
    { id: "pages",     label: "Pages",     icon: "☰" },
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandDot} />
          <span style={styles.brandText}>Blood Bank</span>
        </div>

        <nav>
          {navItems.map(item => (
            <div
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                ...styles.navItem,
                ...(page === item.id ? styles.navItemActive : {})
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Logout at bottom of sidebar */}
        <div style={styles.sidebarBottom}>
          <div
            style={styles.logoutBtn}
            onClick={() => {
              setIsLoggedIn(false);
              setPage("dashboard");
            }}
          >
            ⎋ Logout
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        <div style={styles.topBar}>
          <h1 style={styles.pageTitle}>
            {navItems.find(i => i.id === page)?.label}
          </h1>
          <div style={styles.adminBadge}>Admin Panel</div>
        </div>

        {/* Dashboard */}
        {page === "dashboard" && (
          <div>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Total Donors</p>
                <h2 style={styles.statValue}>{stats.donors}</h2>
                <p style={styles.statSub}>Registered in donor_details</p>
              </div>
              <div style={{ ...styles.statCard, ...styles.statCardRed }}>
                <p style={styles.statLabel}>Blood Requests</p>
                <h2 style={styles.statValue}>{stats.queries}</h2>
                <p style={styles.statSub}>Entries in contact_query</p>
              </div>
            </div>
            <div style={styles.infoBox}>
              <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
              Go to <strong>Donors</strong> to add/remove donors. Go to <strong>Requests</strong> to view or submit blood requests.
              </p>
            </div>
          </div>
        )}

        {/* Donors */}
        {page === "donors" && (
          <div style={styles.donorsLayout}>
            <AddDonor onAdd={() => setRefresh(!refresh)} />
            <DonorList refresh={refresh} />
          </div>
        )}

        {/* Requests — reads & writes contact_query table */}
        {page === "requests" && <Requests onQuerySubmit={() => setRefresh(!refresh)} />}

        {/* Pages */}
        {page === "pages" && <Pages />}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    background: "#f8fafc",
  },
  sidebar: {
    width: "220px",
    background: "#0f172a",
    color: "white",
    padding: "28px 0",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0 20px",
    marginBottom: "32px",
  },
  brandDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "#ef4444",
    boxShadow: "0 0 8px #ef4444",
  },
  brandText: {
    fontWeight: "700",
    fontSize: "17px",
    letterSpacing: "-0.3px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "11px 20px",
    cursor: "pointer",
    color: "#94a3b8",
    fontSize: "14px",
    fontWeight: "500",
    borderLeft: "3px solid transparent",
    transition: "all 0.15s",
  },
  navItemActive: {
    background: "rgba(239,68,68,0.12)",
    color: "#ef4444",
    borderLeftColor: "#ef4444",
  },
  navIcon: {
    fontSize: "14px",
    width: "18px",
    textAlign: "center",
  },
  sidebarBottom: {
    marginTop: "auto",
    padding: "20px",
  },
  logoutBtn: {
    color: "#64748b",
    fontSize: "13px",
    cursor: "pointer",
    padding: "8px 0",
    fontWeight: "500",
    transition: "color 0.15s",
  },
  main: {
    flex: 1,
    padding: "32px 36px",
    overflowY: "auto",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
  },
  pageTitle: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "-0.5px",
  },
  adminBadge: {
    background: "#fef2f2",
    color: "#ef4444",
    fontSize: "12px",
    fontWeight: "600",
    padding: "4px 12px",
    borderRadius: "20px",
    border: "1px solid #fecaca",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    marginBottom: "20px",
    maxWidth: "560px",
  },
  statCard: {
    background: "white",
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
    border: "1px solid #f1f5f9",
  },
  statCardRed: {
    background: "#fff8f8",
    border: "1px solid #fecaca",
  },
  statLabel: {
    margin: "0 0 6px",
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statValue: {
    margin: "0 0 4px",
    fontSize: "42px",
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: 1,
  },
  statSub: {
    margin: 0,
    fontSize: "12px",
    color: "#94a3b8",
  },
  infoBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "14px 18px",
    maxWidth: "560px",
  },
  donorsLayout: {
    display: "flex",
    gap: "24px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
};

export default App;

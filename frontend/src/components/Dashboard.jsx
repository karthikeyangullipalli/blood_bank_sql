import { useEffect, useState } from "react";
import API from "../api";

function Dashboard() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    API.get("/donors").then(res => {
      setCount(res.data.length);
    });
  }, []);

  return (
    <div style={styles.card}>
      <h2>Total Donors</h2>
      <h1>{count}</h1>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center"
  }
};

export default Dashboard;
import { useEffect, useState } from "react";
import API from "../api";

function Pages() {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    API.get("/donors/pages").then(res => setPages(res.data));
  }, []);

  return (
    <div>
      <h2>Website Content</h2>

      {pages.map(p => (
        <div key={p.page_id} style={styles.card}>
          <h3>{p.page_name}</h3>
          <div dangerouslySetInnerHTML={{ __html: p.page_data }} />
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "8px"
  }
};

export default Pages;
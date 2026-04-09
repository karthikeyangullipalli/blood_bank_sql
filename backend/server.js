const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const donorRoutes = require("./routes/donorRoutes");

app.use("/api/donors", donorRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
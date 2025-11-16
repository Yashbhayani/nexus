const express = require("express");
const cors = require("cors");
require("./db");
// Load associations (VERY IMPORTANT)
require("./asso/main");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/api/usertype", require("./routers/usertype"));
app.use("/api/auth", require("./routers/auth"));

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`✅ Server started on http://localhost:${PORT}`)
);

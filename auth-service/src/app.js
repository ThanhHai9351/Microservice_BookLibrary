const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/validate", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

app.post("/token", (req, res) => {
  const { userId, role } = req.body;
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});

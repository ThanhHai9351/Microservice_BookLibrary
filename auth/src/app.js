const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
require("dotenv").config();
const bodyParser = require("body-parser");
const mongodbConnect = require("./db/connectMongoose-auth");
const routes = require("./auth.routes");

const app = express();
app.use(limiter);
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));

routes(app);

const PORT = process.env.PORT || 5004;

app.listen(PORT, async () => {
  await mongodbConnect();
  console.log(`Auth Service running on port ${PORT}`);
});

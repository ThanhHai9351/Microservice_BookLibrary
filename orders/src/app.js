const express = require("express");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const cors = require("cors");
require("dotenv").config();
const { mongodbConnect } = require("./db/connectMongoose-order");
const routes = require("./order.routes");

const app = express();

app.use(cors());
app.use(limiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));

const port = process.env.PORT || 5003;

routes(app);

app.listen(port, async () => {
  await mongodbConnect();
  console.log(`Server is running : ${port} -- This is our Orders service`);
});

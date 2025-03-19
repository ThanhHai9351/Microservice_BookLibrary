const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const Customer = require("./models/Customer");
const { mongodbConnect } = require("./db/connectMongoose-customer");
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const cors = require("cors");
const routes = require("./customer.routes");

const app = express();
const port = process.env.PORT || 5002;
app.use(limiter);
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));

routes(app);

app.listen(port, async () => {
  await mongodbConnect();
  console.log(`Server is running : ${port} -- This is our Customers service`);
});

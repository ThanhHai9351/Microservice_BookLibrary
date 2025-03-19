const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Book = require("./models/Book");
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const cors = require("cors");
require("dotenv").config();
const { mongodbConnect } = require("./db/connectMongoose-book");
const routes = require("./book.routes");

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(limiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));

routes(app);

app.listen(port, async () => {
  await mongodbConnect();
  console.log(`Server is running : ${port} -- This is our Books service`);
});

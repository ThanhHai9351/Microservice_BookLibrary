const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Order = require("./Order");
const axios = require("axios");
const app = express();
const port = 5003;

app.use(bodyParser.json());

const mongodbConnect = async () => {
  try {
    await mongoose.connect(`mongodb://127.0.0.1:27017/Orders`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
    console.log("Error connecting to MongoDB");
  }
};

app.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/", async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    const customer = await axios.get(
      `http://localhost:5002/customers/${order.customerId.toString()}`
    );
    const book = await axios.get(
      `http://localhost:5001/books/${order.bookId.toString()}`
    );
    res.status(200).json({ order, customer: customer.data, book: book.data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  mongodbConnect();
  console.log(`Server is running : ${port} -- This is our Orders service`);
});

//customerId, BookId, GotDate, DeliveryDate

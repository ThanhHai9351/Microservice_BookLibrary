const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, required: true },
  gotDate: { type: Date, required: true },
  deliveryDate: { type: Date, required: true },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

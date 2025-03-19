const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("./order.controller");

const routes = (app) => {
  app.post("/", createOrder);
  app.get("/", getOrders);
  app.get("/:id", getOrderById);
  app.put("/:id", updateOrder);
  app.delete("/:id", deleteOrder);
};

module.exports = routes;

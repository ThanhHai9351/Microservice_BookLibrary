const {
  getCustomers,
  getMe,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("./customer.controller");

const routes = (app) => {
  app.get("/", getCustomers);

  app.get("/me", getMe);

  app.get("/:id", getCustomerById);

  app.put("/:id", updateCustomer);

  app.delete("/:id", deleteCustomer);
};

module.exports = routes;
